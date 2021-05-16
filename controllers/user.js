let ShemaAccount = require("../shema/Account.shema");
const bcrypt = require("bcrypt");

exports.signup = (req,res,next)=>{
    bcrypt.hash(req.body.password,10).then(hash=>{
        ShemaAccount.findOne({email:req.body.email})
        .then(user=>{
            if(!user){
                let newUser = new ShemaAccount({
                    email: req.body.email,
                    password: hash
                })
                newUser.save()
                .then(user=>{
                    res.status(201)
                    console.log("un nouveau utilisateur a été crée");
                    console.log(user);        
                })
                .catch(err=>{
                    res.status(500).json(err)
                })
            }
            else{
                return res.status(400).send("L'email que vous avez saissi est deja utilisé")
            }
        })
    }).catch(err=>{
        res.status(500).json(err)
    })
}

exports.login = (req,res,next)=>{
    ShemaAccount.findOne({email:req.body.email})
    .then(user=>{
        if(!user){
            return res.status(500).json({message:"utilisateur non trouvé"})
        }
        bcrypt.compare(req.body.password,user.password)
        .then(valid=>{
            if(!valid){
                res.status(404);
                res.redirect("http://localhost:3000/errorPage")
                
            }
            else{
                console.log("les identifiant sont correct")
                res.status(200).json({
                    token: "TOKEN",
                    userID: user._id
                })
            }
        })
        .catch(err=>{
            res.status(500).json(err)
        })
    }).catch(err=>{
        res.status(500).json(err)
    })
}