import firebase from 'react-native-firebase';
import { Platform } from 'react-native';
import moment from 'moment';

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

    writeTheUserToDatabase = (name: string, email: string, uid: string, image: string) => {
        let selected = false
        firebase.database().ref('Users/' + uid).set({
            email,
            name,
            uid,
            image,
            selected,
        }).then((data) => {
            console.log('data ', data)
        }).catch((error) => {
            console.log('error ', error)
        })
    }

    writeGroupToDatabase = (name: string, users: Array<string>) => {
        let Users = []
        let typing = false
        for (let i = 0; i < users.length; i++) {
            Users.push(users[i][0])
            let _name = users[i][1].name
            firebase.database().ref('Typing/' + name + '/' + users[i][0]).set({ typing, _name })
        }
        firebase.database().ref('GroupUsers/' + name).set({ Users })

        let user = { GroupName: name, _id: '', avatar: '', name: '' }
        let text = 'No messages yet!'
        var dated = moment()
            .utcOffset('+05:30')
            .format(' hh:mm a');
        var DayTime = moment()
            .utcOffset('+05:30')
            .format('DD MMM,YYYY');

        const message = { text, user, gettingTime: dated, createdAt: new Date().getTime(), onDay: DayTime, otherName: name, otherId: name };
        firebase.database().ref('Inbox/' + 'GroupChat/' + name).set(message)
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

    uploadPic = (uid: string, chatRoomId: string, paths: any, callback: Function, uniqueID: number) => {
        if (!!paths) {
            const imageRef = firebase.storage().ref('profilePic/' + chatRoomId + uid).child(uniqueID.toString());
            return imageRef.putFile(paths, { contentType: 'jpg' })
                .then(() => {
                    return imageRef.getDownloadURL();
                })
                .then(url => {
                    callback(url, uniqueID.toString())
                })
                .catch(error => {
                    console.warn('Error uploading image: ', error);
                });
        } else {
            callback(null)
        }
    }

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
            alert('Unable to update avatar. You must login first.');
        }
    };

    // changeLastSeenMessage = (message: string, uid: string, time: string) => {
    //     if (message !== '') {
    //         let toUpdate = firebase.database().ref('Users/' + uid)
    //         toUpdate.update({ message: message, time: time })
    //     }
    // }

    // Storing msgs on Firebase Database
    send = (messages: any) => {
        for (let i = 0; i < messages.length; i++) {
            const { text, user } = messages[i];

            var dated = moment()
                .utcOffset('+05:30')
                .format(' hh:mm a');

            var DayTime = moment()
                .utcOffset('+05:30')
                .format('DD MMM,YYYY');

            const message = { text, user, gettingTime: dated, createdAt: new Date().getTime(), onDay: DayTime };
            firebase.database().ref('ChatRooms/' + user.idRoom).push(message)
            // firebase.database().ref('GroupChats/').push(message)
            let inboxThisMessage = { text, gettingTime: dated, createdAt: new Date().getTime(), id: user._id, otherId: user.otherID, thisName: user.name, otherName: user.otherPersonName }
            let inboxOtherMessage = { text, gettingTime: dated, createdAt: new Date().getTime(), id: user.otherID, otherId: user._id, thisName: user.otherPersonName, otherName: user.name }
            firebase.database().ref('Inbox/' + 'OneonOne/' + user._id + '/' + user.otherID).set(inboxThisMessage)
            firebase.database().ref('Inbox/' + 'OneonOne/' + user.otherID + '/' + user._id).set(inboxOtherMessage)

            let typing = { typing: false }
            firebase.database().ref('Typing/' + user.idRoom + '/' + user._id).set(typing)
            firebase.database().ref('Typing/' + user.idRoom + '/' + user.otherID).set(typing)

        }
    };

    //Send image message

    sendImageMessage = (
        chatRoomId: string,
        senderId: string,
        senderName: string,
        otherID: string,
        otherName: string,
        avatar: string,
        createdAt: number,
        fileURL: string,
        type: string,
        mime: string
    ) => {

        var dated = moment()
            .utcOffset('+05:30')
            .format(' hh:mm a');

        var DayTime = moment()
            .utcOffset('+05:30')
            .format('DD MMM,YYYY');

        let text = 'File Attachment'
        if (mime === 'image/jpeg') {
            if (type === 'OneOnOne') {
                let user = {
                    name: senderName,
                    avatar: avatar,
                    idRoom: chatRoomId,
                    _id: senderId,
                    otherID: otherID,
                    otherPersonName: otherName
                }

                const message = { user, text, createdAt: createdAt, gettingTime: dated, onDay: DayTime, image: fileURL };
                firebase.database().ref('ChatRooms/' + chatRoomId).push(message)

                let inboxThisMessage = { text, image: fileURL, gettingTime: dated, createdAt: createdAt, id: senderId, otherId: otherID, thisName: senderName, otherName: otherName }
                let inboxOtherMessage = { text, image: fileURL, gettingTime: dated, createdAt: createdAt, id: otherID, otherId: senderId, thisName: otherName, otherName: senderName }
                firebase.database().ref('Inbox/' + 'OneonOne/' + senderId + '/' + otherID).set(inboxThisMessage)
                firebase.database().ref('Inbox/' + 'OneonOne/' + otherID + '/' + senderId).set(inboxOtherMessage)
            } else if (type === 'Group') {
                let user = {
                    GroupName: chatRoomId,
                    _id: senderId,
                    avatar: avatar,
                    name: senderName
                }
                const message = { text, user, image: fileURL, gettingTime: dated, createdAt: new Date().getTime(), onDay: DayTime, otherName: otherName, otherId: otherID };
                firebase.database().ref('SelectedGroupChat/' + chatRoomId).push(message)
                firebase.database().ref('Inbox/' + 'GroupChat/' + chatRoomId).set(message)
            }
        } else if (mime === 'video/mp4') {
            let text = 'Video Attachment'
            if (type === 'OneOnOne') {
                let user = {
                    name: senderName,
                    avatar: avatar,
                    idRoom: chatRoomId,
                    _id: senderId,
                    otherID: otherID,
                    otherPersonName: otherName
                }

                const message = { user, text, createdAt: createdAt, gettingTime: dated, onDay: DayTime, video: fileURL };
                firebase.database().ref('ChatRooms/' + chatRoomId).push(message)

                let inboxThisMessage = { text, video: fileURL, gettingTime: dated, createdAt: createdAt, id: senderId, otherId: otherID, thisName: senderName, otherName: otherName }
                let inboxOtherMessage = { text, video: fileURL, gettingTime: dated, createdAt: createdAt, id: otherID, otherId: senderId, thisName: otherName, otherName: senderName }
                firebase.database().ref('Inbox/' + 'OneonOne/' + senderId + '/' + otherID).set(inboxThisMessage)
                firebase.database().ref('Inbox/' + 'OneonOne/' + otherID + '/' + senderId).set(inboxOtherMessage)
            } else if (type === 'Group') {
                let user = {
                    GroupName: chatRoomId,
                    _id: senderId,
                    avatar: avatar,
                    name: senderName
                }
                const message = { text, user, video: fileURL, gettingTime: dated, createdAt: new Date().getTime(), onDay: DayTime, otherName: otherName, otherId: otherID };
                firebase.database().ref('SelectedGroupChat/' + chatRoomId).push(message)
                firebase.database().ref('Inbox/' + 'GroupChat/' + chatRoomId).set(message)
            }
        }


    }

    //sending the messages in the group chat
    sendMultiChat = (messages: any) => {
        for (let i = 0; i < messages.length; i++) {
            const { text, user } = messages[i];
            var dated = moment()
                .utcOffset('+05:30')
                .format(' hh:mm a');

            var DayTime = moment()
                .utcOffset('+05:30')
                .format('DD MMM,YYYY');
            const message = { text, user, gettingTime: dated, createdAt: new Date().getTime(), onDay: DayTime, otherName: user.GroupName, otherId: user.GroupName };
            firebase.database().ref('SelectedGroupChat/' + user.GroupName).push(message)
            firebase.database().ref('Inbox/' + 'GroupChat/' + user.GroupName).set(message)
        }
    };

    //reading entire users
    readUserData(callback: Function) {
        firebase.database().ref('Users/').on('value', function (snapshot: any) {
            callback(snapshot.val())
        })
    }

    //reading last messages
    readInboxData(uid: string, callback: Function) {

        firebase.database().ref('Inbox/' + 'OneonOne/').child(uid).on('value', function (snapshot: any) {
            callback(snapshot.val())
        })
    }

    //reading the group users
    readGroupChatData(callback: Function) {
        firebase.database().ref('GroupUsers/').on('value', function (snapshot: any) {
            callback(snapshot.val())
        })
    }

    //get specific  group chat data
    readGroupChatSpecific(chatRoomName: string, callback: Function) {
        firebase.database().ref('GroupUsers/').child(chatRoomName).child('Users/').on('value', function (snapshot: any) {
            callback(snapshot.val())
        })
    }

    //getting the groupData
    readGroupChatMessages(callback: Function) {
        firebase.database().ref('SelectedGroupChat/').on('value', function (snapshot: any) {
            callback(snapshot.val())
        })
    }

    //reading the last messages in a group
    readLastMessageGroup(callback: Function) {
        firebase.database().ref('Inbox/' + 'GroupChat/').on('value', function (snapshot: any) {
            callback(snapshot.val())
        })
    }

    // Load msgs from Database to Chat
    refOn = (chatPerson: string, callback: Function) => {
        const onReceive = (data: any) => {
            if (data._value) {
                const message = data.val();
                let keys = Object.keys(message)
                let messages = [];
                for (let i = 0; i < keys.length; i++) {
                    let a = keys[i]
                    let mess = message[a]
                    let msg = { mess, id: a }
                    messages.push(msg)
                }
                callback(messages)
            }
        };

        firebase.database().ref('ChatRooms/' + chatPerson) //good for personal ones 
            .limitToLast(20)
            .on('value', onReceive);
    }

    //For group messages
    getGroupMessages = (chatRoomName: string, callback: Function) => {
        const onReceive = (data: any) => {
            // console.log('getting the data', data)
            if (data._value) {
                const message = data.val();
                let keys = Object.keys(message)
                let messages = [];
                for (let i = 0; i < keys.length; i++) {
                    let a = keys[i]
                    let mess = message[a]
                    let msg = { mess, id: a }
                    messages.push(msg)
                }
                callback(messages)
            }
        };
        firebase.database().ref('SelectedGroupChat/' + chatRoomName) //good for personal ones 
            .orderByKey()
            .limitToLast(20)
            .on('value', onReceive)
    }

    //For one group for all users and things
    // GroupChatRefOn = (callback: Function) => {
    //     firebase.database().ref('GroupChats/') //good for group chats 
    //         .limitToLast(20)
    //         .on('child_added', (snapshot: any) => { callback(this.parse(snapshot)) });
    // }

    //parsing my data
    parse = (snapshot: any) => {
        const { createdAt: numberStamp, text, user } = snapshot.val();
        const { key: id } = snapshot;
        const { key: _id } = snapshot;
        const createdAt = new Date(numberStamp);
        const message = { id, _id, createdAt, text, user };
        return message;
    };

    //Trying to get the previous data
    getPreviousMessages = (chatPerson: string, lastMessageKey: string, callback: Function) => {
        const onReceive = (data: any) => {
            const message = data.val();
            let keys = Object.keys(message)
            let messages = [];
            for (let i = 0; i < keys.length; i++) {
                let a = keys[i]
                let mess = message[a]
                let msg = { mess, id: a }
                messages.push(msg)
            }
            callback(messages)
        };

        firebase.database().ref('ChatRooms/')
            .child(chatPerson)
            // .orderByKey()
            .limitToLast(20)
            .endAt(lastMessageKey)
            .on('value', onReceive);
    }
    // Getting group messages
    getPreviousGroupMessages = (chatRoomName: string, lastMessageKey: string, callback: Function) => {
        const onReceive = (data: any) => {
            const message = data.val();
            let keys = Object.keys(message)
            let messages = [];
            for (let i = 0; i < keys.length; i++) {
                let a = keys[i]
                let mess = message[a]
                let msg = { mess, id: a }
                messages.push(msg)
            }
            callback(messages)
        };

        firebase.database().ref('SelectedGroupChat/')
            .child(chatRoomName)
            .orderByKey()
            .limitToLast(20)
            .endAt(lastMessageKey)
            .on('value', onReceive);
    }

    //refOff for only users though
    refOff() {
        firebase.database().ref('Users/').off();
    }

    //getting typing value for the group
    getTypingValueForGroup = (chatRoomName: string, callback: Function) => {
        firebase.database().ref('Typing/' + chatRoomName) //good for personal ones 
            .on('value', (snapshot: any) => { callback(snapshot) });
    }

    //getting typing value
    getTypingValue = (chatRoomID: string, chatPerson: string, callback: Function) => {
        firebase.database().ref('Typing/' + chatRoomID + '/' + chatPerson + '/' + 'typing') //good for personal ones 
            .on('value', (snapshot: any) => { callback(snapshot.val()) });
    }

    //Changing the value of the typing text
    ChangeTypingText = (chatRoomId: string, personalID: string, value: any) => {
        firebase.database().ref('Typing/' + chatRoomId + '/' + personalID + '/' + 'typing').set(value)
    };
}
const firebaseSDK = new FirebaseSDK();
export default firebaseSDK;