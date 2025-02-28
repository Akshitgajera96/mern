const Task = require('../models/task');

app.get('/',async(req, res)=>{
    try{
        const tsaks = await Task.find({});
        res.render('index',{tasks});
    }
    catch(error){
        console.log(err);
    }
});

app.post('/add-task',async()=>{
    const taskname =req.body.name;
    
    const newTask = new Task({
        name: taskName,
    });
    try{
        await newTask.save();
        res.redirect('/');
    }
    catch{
        console.log(err);
    }
})