const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const ProfileSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'    // ref to database 'users'
    },
    handle: {
        type: String,
        require: true,
        max: 40
    },
    company: {
        type: String
    },
    website: {
        type: String
    },
    location: {
        type: String
    },
    status: {
        type: String,
        require: true
    },
    skills: {
        type: [String], // ปะกาดให้เป็น array
        require: true
    },
    contact: {
        type: String, 
    },
    bio: {
        type: String
    },
    githubusername: {
        type: String
    },
    experience: [ // ที่เป็น array ย้อนว่ามันอาดจะมีได้หลายกว่า 1 ปะสบกาน
        {
            title: {
                type: String,
                required: true
            },
            company: {
                type: String,
                required: true
            },
            location: {
                type: String
            },
            from: {
                type: Date,
                required: true
            },
            to: {
                type: Date
            },
            current: {
                type: Boolean,
                default: false
            },
            description: {
                type: String
            }
        }
    ],
    education: [ // ที่เป็น array ย้อนว่ามันอาดจะมีได้หลายกว่า 1 บ่อนเรียน
        {
            school: {
                type: String,
                required: true
            },
            degree: {
                type: String,
                required: true
            },
            fieldofstudy: {
                type: String
            },
            from: {
                type: Date,
                required: true
            },
            to: {
                type: Date
            },
            current: {
                type: Boolean,
                default: false
            },
            description: {
                type: String
            }
        }
    ],
    social: { // ที่เป็น object ย้อนว่าอยากให้มีแต่ 1 social 
        youtube: {
            type: String
        },
        twitter: {
            type: String
        },
        facebook: {
            type: String
        },
        linkedin: {
            type: String
        },
        instagram: {
            type: String
        }
    },
    date: {
        type: Date,
        default: Date.now
    }
    
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);