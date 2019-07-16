const Joi=require('joi');

const userValidator=(user)=>{
    const schema=Joi.object().keys({
        name:Joi.string().required(),
        email:Joi.string().email(),
        password:Joi.string().required()
    })
    return Joi.validate(user,schema);
}

module.exports=userValidator;