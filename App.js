import * as Notification from 'expo-notifications';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { StyleSheet, Button, View, Alert, Platform } from 'react-native';
import Constants from 'expo-constants'
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

  useEffect(() => {
    const configurePushNotifications = async () => {
      console.log('ffffffffffffffffffff')
      if(Platform.OS === "android"){
        // define in which channel notification should be recieved there (only required for android)
        Notification.setNotificationChannelAsync('default',{
          name: 'default',
          importance: Notification.AndroidImportance.DEFAULT //periority of notification
        })
      }
      const { status } = await Notification.getPermissionsAsync();
      let finalStatus = status;

      // ask user for permission
      if (finalStatus !== 'granted') {
        const { status } = await Notification.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        Alert('Permission Required', 'Push notification need a permission.');
        return;
      }


      // get pushTokenData after get permission
      const pushTokenData = await Notification.getExpoPushTokenAsync({
        projectId: Constants.expoConfig.extra.eas.projectId,
      });
      console.log('TOKEN = ', pushTokenData);


    }
    configurePushNotifications();

  }, [])
  useEffect(() => {
    // will excute whenever notification recieved on the device
    const subscription = Notification.addNotificationReceivedListener((notification) => {
      console.log('notification recieved');
      console.log(notification);
      console.log(notification.request.content.data.userName);
    });

    // when user tab the notification , the app will be opened (normal behavior on OS of device)
    // will excute when user tab (response) the notification 
    const responseSubscripion = Notification.addNotificationResponseReceivedListener((response) => {
      console.log('notification responsed');
      console.log(response);
      console.log(response.notification.request.content.data.userName)
    })
    return () => {
      // will remove when the component is removed.
      subscription.remove();
      responseSubscripion.remove()
    }
  }, [])
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
  const sendPushNotificationHandler = () => {
    fetch("https://exp.host/--/api/v2/push/send",{

      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to: '', // to push pushTokenData
        title: 'Test - sent from a device',
        body: 'this is a test'
      })
    })
  }

  return (
    <View style={styles.container}>
      <Button title='Schedulle  Local Notification' onPress={scheduleNotificationHandler}></Button>
      <Button title='Send Push Notification' onPress={sendPushNotificationHandler}></Button>
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
