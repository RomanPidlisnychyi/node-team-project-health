module.exports = Validator = async (data, schema) => {
    try {
        const { value, error } = await schema.validate(data);
        if (error) {
            // console.log('validate: ', error.message)
            return error.details.map(el => el.message)[0];     
        }
    }
    catch (err) {
        console.log(err);
    }
}