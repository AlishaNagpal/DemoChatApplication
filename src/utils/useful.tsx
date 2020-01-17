 // getUnique = (array: any) => {
    //     var uniqueArray = [];

    //     // Loop through array values
    //     for (let i = 0; i < array.length; i++) {
    //         if (uniqueArray.indexOf(array[i]) === -1) {
    //             uniqueArray.push(array[i]);
    //         }
    //     }
    //     return uniqueArray;
    // }


    // if (this.state.lastMessageSearch) {
        //     this.setState({  })
        //     let temp = this.state.data
        //     for (let i = 0; i < this.state.lastMessageSearch.length; i++) {
        //         let index = temp.findIndex((item: any) => item[0] === this.state.lastMessageSearch[i][0])
        //         this.state.updatedData.push(temp[index])
        //     }
        //     console.log('this.state.updatedData', this.state.updatedData)

        // }

        // let temp: Array<any> = result;
        // if (temp && Array.isArray(temp)) {
        //     //@ts-ignore
        //     let index = temp.findIndex((item: any) => item[0] === this.state.uid)
        //     if (index !== -1) {
        //         
        //         let chatRoomToFind = temp[index]
        //         this.setState({
        //             lastMessageSearch: chatRoomToFind[1]
        //         })
        //         setTimeout(() => {
        // let message = this.state.lastMessageSearch
        // let keys = Object.keys(message)
        // console.log('keys', keys)

        //             //to get the updated data
        //             for (let i = 0; i < keys.length; i++) {
        //                 for (let j = 0; j < this.state.data.length; j++) {
        //                     if (keys[i] === this.state.data[j][0]) {
        //                         this.state.updatedData.push(this.state.data[j])
        //                     }
        //                 }
        //                 // FirebaseService.changeLastSeenMessage(message[uidTocheck].text, uidTocheck, message[uidTocheck].createdAt)
        //             }
        //             console.log('repeat', this.state.updatedData)

        //             //getting the last message of the updated
        //             for (let z = 0; z < keys.length; z++) {
        //                 let uidTocheck: any = keys[z]
        //                 for (let k = 0; k < this.state.updatedData.length; k++) {
        //                     if (keys[z] === this.state.updatedData[k][0]) {
        //                         this.state.updatedData[k][1].message = message[uidTocheck].text

        //                         this.state.updatedData[k][1].time = message[uidTocheck].createdAt
        //                     }
        //                 }
        //             }
        //             this.forceUpdate()
        //         }, 500);
        //     }
        // }