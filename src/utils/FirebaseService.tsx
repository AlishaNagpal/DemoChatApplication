import firebase from 'react-native-firebase';
import { Platform } from 'react-native';

class FirebaseSDK {

    constructor() {
        if (!firebase.apps.length) {
            //avoid re-initializing
            firebase.initializeApp({
                apiKey: 'AIzaSyAzN0TF3b-4Puv48Q8HPxBcgelXfX0fk7k',
                appId: Platform.OS === 'ios'
                    ? '1:987349181654:ios:ea6f10d7cc8f43e9731577'
                    : '1:987349181654:android:358a731f4aadec3e731577',
                databaseURL: 'https://chatapp-8f75b.firebaseio.com',
                messagingSenderId: '987349181654',
                projectId: 'chatapp-8f75b',
                storageBucket: 'chatapp-8f75b.appspot.com',
            },
                'chatapp');
        }
    }
    login = (user: any, success_callback: any, failed_callback: any) => {
        firebase
            .auth()
            .signInWithEmailAndPassword(user.email, user.password)
            .then(success_callback, failed_callback);
    };

    readUserData(callback: Function) {
        firebase.database().ref('Users/').on('value', function (snapshot: any) {
            callback(snapshot.val())
        })
    }

    readInboxData(uid: string, callback: Function) {
        firebase.database().ref('Inbox/').child(uid).on('value', function (snapshot: any) {
            callback(snapshot.val())
        })
    }

    writeTheUserToDatabase = (name: string, email: string, uid: string, image: string) => {
        let message = 'No chat has occured yet!'
        let time = ''
        let selected = false
        firebase.database().ref('Users/' + uid).set({
            email,
            name,
            uid,
            image,
            message,
            time,
            selected
        }).then((data) => {
            console.log('data ', data)
        }).catch((error) => {
            console.log('error ', error)
        })
    }

    createAccount = (user: any, callback: Function) => {
        firebase
            .auth()
            .createUserWithEmailAndPassword(user.email, user.password)
            .then(
                function () {
                    console.log('created user successfully. User email:' + user.email + ' name:' + user.name);
                    var userf = firebase.auth().currentUser
                    //@ts-ignore
                    callback(userf._user.uid),
                        //@ts-ignore
                        userf.updateProfile({ displayName: user.name }).then(
                            function () {
                                console.log('Updated displayName successfully. name:' + user.name, user);
                            },
                            function (error) {
                                console.warn('Error update displayName.');
                            }
                        );
                },
                function (error) {
                    console.error('got error:' + typeof error + ' string:' + error.message);
                    alert('Create account failed. Error: ' + error.message);
                }
            )
    };

    uploadImage = async (uri: string, email: string) => {
        try {
            const ref = firebase
                .storage()
                .ref('Images')
                .child(email);
            const task = ref.putFile(uri);
            console.log("Here Task=>", task)
            //@ts-ignore
            let imageURL = await new Promise((resolve, reject) => {
                task.then((snap) => {
                    ref.getDownloadURL().then((data) => {
                        resolve(data);
                    })
                })
            })
            return (imageURL)
        } catch (err) {
            console.log('uploadImage try/catch error: ' + err.message);
        }
    };

    updateAvatar = (url: string) => {

        var userf = firebase.auth().currentUser;
        if (userf != null) {
            userf.updateProfile({ avatar: url }).then(
                function () {
                    console.log('Updated avatar successfully. url:' + url);
                    alert('Avatar image is saved successfully.');
                },
                function (error: any) {
                    console.warn('Error update avatar.');
                    alert('Error update avatar. Error:' + error.message);
                }
            );
        } else {
            console.log("can't update avatar, user is not login.");
            alert('Unable to update avatar. You must login first.');
        }
    };


    // Storing msgs on Firebase Database
    send = (messages: any) => {
        // console.log('gettin the messages', messages)
        for (let i = 0; i < messages.length; i++) {
            const { text, user } = messages[i];
            let date = new Date()
            let day = date.getDate()
            let Hours = date.getHours()
            let minutes = date.getMinutes()
            let AMPM = 'AM'
            if (Hours >= 12) {
                AMPM = 'PM'
            }
            var months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
            var monthName = months[date.getMonth()];
            const message = { text, user, gettingTime: Hours + ':' + minutes + ' ' + AMPM, createdAt: new Date().getTime(), onDay: day + ' ' + monthName };
            console.log('msg sended ', message)
            firebase.database().ref('ChatRooms/' + user.idRoom).push(message)
            firebase.database().ref('GroupChats/').push(message)
            firebase.database().ref('Inbox/' + user._id + '/' + user.otherID).set(message)
            firebase.database().ref('Inbox/' + user.otherID + '/' + user._id).set(message)
        }
    };

    sendMultiChat = (messages: any) => {
        for (let i = 0; i < messages.length; i++) {
            const { text, user } = messages[i];
            let date = new Date()
            let Hours = date.getHours()
            let minutes = date.getMinutes()
            let AMPM = 'AM'
            if (Hours >= 12) {
                AMPM = 'PM'
            }
            const message = { text, user, createdAt: Hours + ':' + minutes + ' ' + AMPM };
            console.log('msg sended ', message)
            firebase.database().ref('SelectedGroupChat/' + user.idRoom).push(message)
        }
    };

    // changeLastSeenMessage = (message: string, uid: string, time: string) => {
    //     if (message !== '') {
    //         let toUpdate = firebase.database().ref('Users/' + uid)
    //         toUpdate.update({ message: message, time: time })
    //     }
    //     console.log('oh my goodness', message, uid)
    // }

    // Load msgs from Database to Chat
    refOn = (chatPerson: string, callback: Function) => {
        firebase.database().ref('ChatRooms/' + chatPerson) //good for personal ones 
            .limitToLast(10)
            .on('child_added', (snapshot: any) => { callback(this.parse(snapshot)) });
    }

    getPreviousMessages = (chatPerson: string, callback: Function) => {
        const onReceive = (data: any) => {
            const message = data.val();
            callback(message);
        };
        firebase.database().ref('ChatRooms/').child(chatPerson).on('child_added', onReceive);
    }

    parse = (snapshot: any) => {
        const { createdAt: numberStamp, text, user } = snapshot.val();
        const { key: id } = snapshot;
        const { key: _id } = snapshot;
        const createdAt = new Date(numberStamp);
        const message = { id, _id, createdAt, text, user };
        return message;
    };

    GroupChatRefOn = (callback: Function) => {
        firebase.database().ref('GroupChats/') //good for group chats 
            .limitToLast(20)
            .on('child_added', (snapshot: any) => { callback(this.parse(snapshot)) });
    }

    refOff() {
        firebase.database().ref('Users/').off();
    }
}
const firebaseSDK = new FirebaseSDK();
export default firebaseSDK;