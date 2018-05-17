const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateProfileInput(data) {
    let errors = {};
    // ถ้า data.name แม่นมีค่าแม่นให้มันเท่ากับ data.name ถ้ามันว่างเป่าแม่นให้มันเท่ากับ ''
    data.handle = !isEmpty(data.handle) ? data.handle : '';
    data.status = !isEmpty(data.status) ? data.status : '';
    data.skills = !isEmpty(data.skills) ? data.skills : '';
    
    if(!Validator.isLength(data.handle, {min: 2, max: 40})) {
        errors.handle = 'Handle must be between 2 and 40 charecters';
    }
    if(Validator.isEmpty(data.handle)) {
        errors.handle = 'Profile Handle is required';
    }
    if(Validator.isEmpty(data.status)) {
        errors.status = 'Status field is required';
    }
    if(Validator.isEmpty(data.skills)) {
        errors.skills = 'Skills field is required';
    }
    
    // Format Website ให้ใส่ได้แต่แบบ URL
    // ถ้ามีกานเพี่มในช่อง website เข้ามา 
    if(!isEmpty(data.website)) {
        // ให้ check เบิ่งว่าเป็น format แบบ url หลืบ่อ ถ้าบ่อให้ return error ออกไป
        if(!Validator.isURL(data.website)) {
            errors.website = 'Not a valid URL';
        }
    }
    if (!isEmpty(data.youtube)) {
        if (!Validator.isURL(data.youtube)) {
            errors.youtube = 'Not a valid URL';
        }
    }
    if (!isEmpty(data.twitter)) {
        if (!Validator.isURL(data.twitter)) {
            errors.twitter = 'Not a valid URL';
        }
    }
    if (!isEmpty(data.facebook)) {
        if (!Validator.isURL(data.facebook)) {
            errors.facebook = 'Not a valid URL';
        }
    }
    if (!isEmpty(data.linkedin)) {
        if (!Validator.isURL(data.linkedin)) {
            errors.linkedin = 'Not a valid URL';
        }
    }
    if (!isEmpty(data.instagram)) {
        if (!Validator.isURL(data.instagram)) {
            errors.instagram = 'Not a valid URL';
        }
    }

    return { 
        errors,
        isValid: isEmpty(errors)
    };
};