const User = require('../models/User');

module.exports.getAllUsers = async (req,res)=> {

    try{
        const users = await User.find().select('-password');
        res.json({
            count: users.length,
            users: users
        })
    }
    catch(err){
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }

}


module.exports.deleteUser = async (req,res) => {

    try{
        const userId = req.params.userId;

        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({ message: 'User not found' });
        } 
        await User.findByIdAndDelete(userId);
        res.json({ message: 'User deleted successfully' });  
    }
    catch(err){
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }

}