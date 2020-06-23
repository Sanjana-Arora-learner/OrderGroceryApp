'use strict';

const response=require('./Response');

const extractEntity=(nlp,entity)=>{
    let obj=nlp[entity] && nlp[entity][0];
    if(obj && obj.confidence > 0.8)
    {
        return obj.value;
    }
    else{
        return null;
    }
}

module.exports = class MessageProcessor {  
    constructor(){
        this.intent='';
    } 
    handleHandoverMessage(serverURL,sender,data)
    {
        let message=[];
        message.push(createWebviewResponse(serverURL,sender,data));
        return message;
    } 

    createMetadataForPassing(message,orderStatus)
    {
        let metadata={
            message,
            orderStatus
        };
        return metadata;
    }
}

//Web View to get consolidated response from user
const createWebviewResponse =(serverURL,sender,data) =>{
    let url=`${serverURL}/options?sid=${sender}&groceryList=${data}`;
    console.log(url);
    return {
        attachment:{
            type:"template",
            payload:{
              template_type:"button",
              text:response.constants.generateMessage,
              buttons:[
                {
                    type: "web_url",
                    url: url,
                    title: "Click Me",
                    webview_height_ratio: "tall",
                    messenger_extensions: true
                }
              ]
            }
          }        
    };

}