/*jshint esversion: 6 */

import 'jquery';
import {templatesLoader} from 'templates-loader';
import {notifier} from 'notifier';
import {userData} from 'user-data';
import {validator} from 'validator';
import {cleaner} from 'cleaner';
import * as toastr from "toastr";

const mainContainer = $('#wrapper');

class UserController {
    register() {
        templatesLoader.load('register')
            .then((templateHTML) => {
                mainContainer.html(templateHTML);
            })
            .then(() => {
                $('#btn-reg').on('click', (ev) => {
                    let $fullName = $('#fullName'),
                        $username = $('#username'),
                        $password = $('#password'),
                        $confirmPassword = $('#confirmPassword'),
                        $email = $('#email');


                    let fullName = $fullName.val(),
                        username = $username.val(),
                        password = $password.val(),
                        confirmPassword = $confirmPassword.val(),
                        email = $email.val();

                    // Validations
                    if(!validator.validateUser(username)) {
                        toastr.error('Username must be between 5 and 20 symbols!', 'Error');
                        cleaner.cleanInputField($username);
                        return;
                    }

                    if(!validator.validatePassword(password)) {
                        toastr.error('Password must be between 5 and 20 symbols!', 'Error');
                        cleaner.cleanInputField($password, $confirmPassword);
                        return;
                    }

                    if(!validator.validateEmail(email)) {
                        toastr.error('E-mail is not valid!', 'Error');
                        cleaner.cleanInputField($email);
                        return;
                    }

                    if(password !== confirmPassword) {
                        toastr.error('Password doesnt match!', 'Error');
                        cleaner.cleanInputField($password, $confirmPassword);
                    }
                        
                    let newUser = {
                        username,
                        password,
                        fullName,
                        email,

                    };

                    userData.register(newUser)
                        .then((user) => {
                            toastr.success('Successfully registered!', 'Success');
                            _toggleCLassWhenLoggedIn();
                            window.location = '#/home';
                        })
                        .catch((err) => {
                            toastr.error('Data is invalid!', 'Error');
                            console.log(err);
                        });

                    ev.preventDefault();
                    return false;  
                });
            });
    }

    login() {
        templatesLoader.load('login')
            .then((templateHTML) => {
                mainContainer.html(templateHTML);
            })
            .then(() => {
                $('#btn-log').on('click', (ev) => {

                    let $username = $('#userName-log'),
                        $password = $('#password-log');

                    let username = $username.val(),
                        password = $password.val();

                    // Validations

                    //   if (!validator.validateUser(username)) {
                    //     notifier.error('Username must be between 5 and 20 symbols!');
                    //     cleaner.cleanInputField($username);
                    //     return;
                    // }

                    // if (!validator.validatePassword(password)) {
                    //     notifier.error('Password must be between 5 and 20 symbols!');
                    //     cleaner.cleanInputField($password, $confirmPassword);
                    //     return;
                    // }

                    let user = {
                        username,
                        password
                    };

                    userData.login(user)
                        .then((user) => {
                            toastr.success('Successfully logged in!', 'Success');
                            _toggleCLassWhenLoggedIn();
                            window.location = '#/home';
                        })
                        .catch((err) => {
                            toastr.error('Wrong username/password!', 'Error');
                            console.log(err);
                        });

                    ev.preventDefault();
                    return false;
                });

            });
    }
    
    logout() {
        userData.logout()
            .then(() => {
                localStorage.removeItem('user');
                localStorage.removeItem('userCredential');

            })
            .then(() => {
                toastr.success('You have logged out successfully!', 'Success');
                _toggleCLassWhenLoggedOut();
                window.location = '#/home';
            })
            .catch((err) => {
                toastr.error('You are not logged in!', 'Error');
                console.log(err);
            });
    }

    
}

 function _toggleCLassWhenLoggedIn() {
        $('#btn-logout').removeClass('hidden');
        $('#btn-login').addClass('hidden');
        $('#btn-signup').addClass('hidden');

    }

   function _toggleCLassWhenLoggedOut() {
        $('#btn-logout').addClass('hidden');
        $('#btn-login').removeClass('hidden');
        $('#btn-signup').removeClass('hidden');
    }

const userController = new UserController();

export {userController};