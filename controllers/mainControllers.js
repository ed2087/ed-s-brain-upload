

exports.homepage = (req, res) => {

    
    res.render('index', {
        title: 'Home Page',
        path: '/',
        alert: null,
    });

    
};