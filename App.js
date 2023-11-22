import * as Notification from 'expo-notifications';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { StyleSheet, Button, View } from 'react-native';

// handle dipsplaying notification and know if it recieved successfully or we have error
Notification.setNotificationHandler({
  handleNotification: async (notification) => {
    //console.log(notification)
    return {
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowAlert: true
    }
  },
  handleError: () => { },
  handleSuccess: () => { }
});

export default function App() {

  useEffect(()=>{
    // will excute whenever notification recieved on the device
    const subscription = Notification.addNotificationReceivedListener((notification)=>{
      console.log('notification recieved');
      console.log(notification);
      console.log(notification.request.content.data.userName);
    });

    // when user tab the notification , the app will be opened (normal behavior on OS of device)
    // will excute when user tab (response) the notification 
    const responseSubscripion = Notification.addNotificationResponseReceivedListener((response)=>{
      console.log('notification responsed');
      console.log(response);
      console.log(response.notification.request.content.data.userName)
    })
    return ()=> {
      // will remove when the component is removed.
      subscription.remove();
      responseSubscripion.remove()
    }
  },[])
  // To schedule notifications
  const scheduleNotificationHandler = () => {
    console.log('trigged')
    Notification.scheduleNotificationAsync({
      content: {
        title: "my first local notification",
        body: "body of notification",
        data: {
          userName: 'MAX'
        }
      },
      trigger: {
        seconds: 2
      }

    })
  }
  return (
    <View style={styles.container}>
      <Button title='schedulle notification' onPress={scheduleNotificationHandler}></Button>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
