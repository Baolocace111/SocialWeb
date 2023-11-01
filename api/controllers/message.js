import { seeMessageService, sendMessageService } from "../services/MessageService.js";
import { AuthService } from "../services/AuthService.js";

export const sendMessageController =async (req,res)=>{
    const userId =await AuthService.verifyUserToken(req.cookies.accessToken);
    const r_userId=await req.body.ruserid;
    const content=await req.body.message;
    sendMessageService(content,userId,r_userId,(err,data)=>{
        //console.log(content);
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
    });
}
export const seeMessageController =async (req,res)=>{
    const userId = await AuthService.verifyUserToken(req.cookies.accessToken);
    //console.log(userId);
    // console.log(req.body.friend_id);
    // console.log(req.body.offset);
    const page={
        user_id: userId,
        friend_id: req.body.friend_id,
        offset: req.body.offset,
    }
    seeMessageService(page,(e,data)=>{
        if(e) { 
            // console.log(e);
            return res.status(500).json(e);}
        return res.status(200).json(data);
    })
}