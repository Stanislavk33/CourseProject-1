define(['views/index', 'view/register', 'view/login', 'view/forgotPassword'],
    function(IndexView, RegisterView, LoginView, ForgotPasswordView) {
        let SocialRouter = Backbone.Router.extend({
            currentView: null,

            routers: {
                "index": "index",
                "login": "login",
                "register": "register",
                "forgotPassword": "forgotPassword"
            },
            changeView: function(view) {
                if (null != this.currentView) {
                    this.currentView.undelegateEvents();
                }
                this.currentView = view;
                this.currentView.render();
            },
            index: function() {
                this.changeView(new IndexView());
            },
            login: function() {
                this.changeView(new LoginView());
            },
            forgotPassword: function() {
                this.changeView(new ForgotPasswordView());
            },
            register: function() {
                this.changeView(new RegisterView());
            }
        });

        return new SocialRouter();
    });