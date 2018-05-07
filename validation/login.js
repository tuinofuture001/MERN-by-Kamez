const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateLoginInput(data) {
    let errors = {};
    // ถ้า data.name แม่นมีค่าแม่นให้มันเท่ากับ data.name ถ้ามันว่างเป่าแม่นให้มันเท่ากับ ''
    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';
    
    if(!Validator.isEmail(data.email)) {
        errors.email = 'Email is invalid';
    }
    if(Validator.isEmpty(data.email)) {
        errors.email = 'Email field is required';
    }
    if(Validator.isEmpty(data.password)) {
        errors.password = 'Password field is required';
    }
    

    return { 
        errors,
        isValid: isEmpty(errors)
    };
};