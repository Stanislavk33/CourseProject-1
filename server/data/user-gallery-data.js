"use strict"

module.exports = function(models) {
    let UserGallery = models.UserGallery;

    return {
        getUserGalleryById(_id) {
            return new Promise((resolve, reject) => {
                UserGallery.find({ "_id": _id }, (err, userGallery) => {
                    if (err){
                        return reject(err);
                    }

                    return resolve(userGallery);
                });
            })
        },
        getUserGalleryByUsername(username) {
            return new Promise((resolve, reject) => {
                UserGallery.find({ "username": username }, (err, userGallery) => {
                    if (err){
                        return reject(err);
                    }

                    return resolve(userGallery);
                });
            })
        },
        createUserGallery(userGallery) {
            let newUserGallery = new UserGallery({
                username: userGallery.username,
                photos: []
            });

            return new Promise((resolve, reject) => {
                newUserGallery.save(err => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(newUserGallery);
                });
            });
        },
        addPhotoToUserGallery(userGalleryId, photo) { //photo object is created in the controller
            return new Promise((resolve, reject) => {
                 UserGallery.findByIdAndUpdate({"_id": userGalleryId},
                 {$push: {"photos": photo}},
                 (err) => {
                     if (err) {
                         return reject(err);
                     }
                 return resolve();
                })
            });
       }     
    };
}