'use strict';

const express = require('express');
const path =require('path');
const config=require('../config');
const FBeamer=require('../fbeamer');

const f=new FBeamer(config.fb);
const router=express.Router();

//For Serving Web Views
router.use( (req, res, next) => {
    console.log('In Web Views: ')
    console.log('Options URL:', req.originalUrl)
    next()
  })

router.get('/', (req, res) => {
    console.log("here");
   /*let referer = req.get('Referer');
if (referer) {
    if (referer.indexOf('www.messenger.com') >= 0) {
        res.setHeader('X-Frame-Options', 'ALLOW-FROM https://www.messenger.com/');
    } else if (referer.indexOf('www.facebook.com') >= 0) {
        res.setHeader('X-Frame-Options', 'ALLOW-FROM https://www.facebook.com/');
    }
    else{
        res.setHeader("Set-Cookie", "HttpOnly;Secure;SameSite=Strict");
    }
    
    
}*/
res.sendFile(path.resolve("Public","Index.html"));
});

router.get('/optionspostback', (req, res) => {
    let body = req.query;
    console.log(body.orderStatus);
    let metadata={orderStatus:body.orderStatus};
    let sender=body.psid;
    f.passControl(sender,config.fb.groceryGenAppId,metadata);
    //pass the thread control to main application
    res.status(200).send('Please close this window to return to the conversation thread.');    
});

module.exports = router;