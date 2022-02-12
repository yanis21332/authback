const ShemaAccount = require("../shema/Account.shema");
const bcrypt = require("bcrypt");
const ObjectId = require("mongoose").Types.ObjectId;
const jwt = require("jsonwebtoken");
require("dotenv").config({
    path: `${__dirname}/config/.env`
})

let maxAge = 1000 * 60 * 60 * 24 * 3
const createToken = id => {
    return jwt.sign({
        id
    }, process.env.JWT_TOKEN_SECRET_KEY, {
        expiresIn: maxAge
    })
}


exports.signup = (req,res)=>{
    console.log("on commence a signuper");
    const {password,email} = req.body

    if(password===""||email===""||email===undefined||password===undefined||password===null||email===null){
        console.error("le champ 'password' et/ou le champ 'email' sont vide !")
        return res.status(200).json({error:"le champ 'password' et/ou le champ 'email' sont vide !"})
    }
    bcrypt.hash(req.body.password,10).then(hash=>{
        ShemaAccount.findOne({email:req.body.email}).then(user=>{
            if(!user){
                let newUser = new ShemaAccount({
                    email: req.body.email,
                    password: hash
                })
                newUser.save().then(user=>{   
                    console.log("un nouveau utilisateur a été crée");
                    console.log(user);        
	                return res.status(201).json(user)
                }).catch(err=>{
                    return res.status(500).json(err)
                })
            }
            else{
                return res.status(200).json({error:"L'email que vous avez saissi est deja utilisé"})
            }
        })
    }).catch(err=>{
        res.status(500).json(err)
    })
}

exports.login = (req,res)=>{
    const {email,password} = req.body;

    if(password===""||email===""||email===undefined||password===undefined||password===null||email===null){
        console.error("le champ 'password' et/ou le champ 'email' sont vide !")
        return res.status(200).json({error:"le champ 'password' et/ou le champ 'email' sont vide !"})
    }

    console.log("on log log tkt meme pas")
    ShemaAccount.findOne({email:email}).then(user=>{
        if(!user){
            console.error("l'utilisateur n'a pas été trouvé")
            return res.status(200).json({error:"utilisateur non trouvé"})
        }
        bcrypt.compare(req.body.password,user.password).then(valid=>{
            if(!valid){
                console.error("le mot de passe est certainement incorrect")
                return res.status(200).json({error:"le mot de passe que vous avez saissi est incorrect"});
            }
            else{
                console.log("les identifiant sont correct")
                let token = createToken(user._id)
                
                return res.status(200).json({
                    token: "TOKEN",
                    userID: token
                })
            }
        })
        .catch(err=>{
            console.log("voici l'erreur: " + err);
            return res.status(500).json(err)
        })
    }).catch(err=>{
        console.log("voici l'erreur: " + err);
        return res.status(500).json(err)
    })
}

exports.getUser = (req,res)=>{
    const userId = req.params.userId;

    ShemaAccount.findById(userId).then(user=>{
        if(!user){
            console.error("l'utilisateur n'a pas été trouvé !" )
            return res.status(200).json({error:"l'utilisateur n'a pas été trouvé !"})
        }

        return res.status(200).json(user)
    }).catch(err=>{
        return res.status(500).json({err:"l'erreur est: " + err})
    })
}
exports.modifyUser = (req,res) => {
    const {email,password,bio,name,phone,userId} = req.body

    if(ObjectId.isValid(userId)){
        ShemaAccount.findById(userId).then(user=>{
            if(!user){
                console.error("l'utilisateur n'a pas été trouvé !")
                return res.status(200).json({error:"l'utilisateur n'a pas été trouvé !"})
            }
            bcrypt.hash(password,10).then(hash=>{
                if(!hash){
                    console.error("erreur lors de la sauvegarde du mot de passe")
                }else{
                    const data = {
                        password:hash,
                        email,
                        phone,
                        bio,
                        name
                    }
                    ShemaAccount.findByIdAndUpdate(userId,data).then(valid=>{
                        if(!valid){
                            console.error("une erreur lors de la mise a jour du profile")
                            return res.status(200).json({error:"une erreur lors de la mise a jour du profile"})
                        }
                        console.log("utilisateur bien modifié !")
                        return res.status(201).json({message:"utilisateur modifié avec succes !"})
                    }).catch(err=>{
                        console.error(err)
                        return res.status(400).json({error:err})
                    })
                }
            })
            
        }).catch(err=>{
            console.error(err)
            return res.status(500).json({err})
        })
    }
}