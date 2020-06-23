'use strict';

const express =require('express');
const config=require('../config');
const FBeamer=require('../fbeamer');
const bodyparser=require('body-parser');
const messageprocessor=require('../Message-Processor');


const router=express.Router();
const f=new FBeamer(config.fb);
const mprocessor= new messageprocessor();

router.use( (req, res, next) => {
    console.log('Request URL:', req.originalUrl)
    console.log('In WebHook: ')
    next()
  })

router.get('/', (req,res,next) => {    
    console.log('Params:', req.query)
    f.registerHook(req,res);
    return next();
});
router.post('/',
	(req, res, next) => {
        var serverURL = 'https://' + req.get('host');
		f.incoming(req, res, msg => {
			// Process messages
            const {
                message,
                sender,
                pageId,
                isHandoverMessage,
                metadata
            } = msg;
            if(isHandoverMessage)
            {
                let response= mprocessor.handleHandoverMessage(serverURL,sender,metadata);
                console.log(response);
                    for(let index=0; index < response.length ; index ++){
                        let m=response[index];
                        f.txt(sender, m,pageId);
                    }
            }
            else if (message) {
                let metadata={message};
                f.passControl(sender,config.fb.groceryGenAppId,metadata);
                
            }         
		});
		return next();
	});

module.exports = router;