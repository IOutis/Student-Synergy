import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
    {
        
        user:{
            type: String,
            required: [true,"User required"],

        },
        task:{
            type:String,
            required:[true,"task required"],
        },
        time:{
            type:Date,
            required:true,
            validate:{
                validator: function(value){
                    return value.getTime() > new Date().getTime();
                }
            },
            message:"Please enter a valid time",
        },
        status:{
            type:String,
            required:true,
            },
        date:{
            type:Date,
            required:true,
            validate:{
                validator:function(value){
                    const today = new Date();
                    today.setHours(0,0,0,0);
                    return value>=today;
                },
                message:"Please enter a valid date",

            }
        },
        description:{
            type:String,
        },
        recurring: {
            type: String,
            enum: ['none', 'one week', 'one month', 'six months', 'once a week', 'once a month'],
            default: 'none',
          },

    }
);

export default mongoose.models.Task || mongoose.model('Task', TaskSchema);