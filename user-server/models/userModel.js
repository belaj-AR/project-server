const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
  fname: {
    type: String,
    required: [true, 'First name required'],
    validate: {
      validator() {
        if (this.fname.length < 3) {
          throw new Error('First name length must be greater than 2')
        }
        let patt = new RegExp(/\d/)
        if (patt.test(this.fname)) {
          throw new Error('First name must be contained with characther only')
        }
      }
    }
  },
  lname: {
    type: String,
    validate: {
      validator() {
        if (this.lname.length !== 0) {
          let patt = new RegExp(/\d/)
          if (patt.test(this.lname)) {
            throw new Error('Last name must be contained with characther only')
          }
          if (this.lname.length < 3) {
            throw new Error('Last name length must be greater than 2')
          }
        }
      }
    }
  },
  email: {
    type: String,
    required: [true, 'Email required'],
    unique: true,
    validate: {
      validator() {
        let patt = new RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/)
        if (!patt.test(this.email)) {
          throw new Error('Email is invalid')
        }
      }
    }
  },
  uid: {
    type: String,
    required: [true, 'uid required'],
    unique: true
  },
  avatar: {
    type: String,
    default: "https://storage.googleapis.com/photo-profile-belaj-ar/defaulPP.jpg"
  },
  role: {
    type: String,
    default: 'user'
  }
});

userSchema.post('validate', doc => {
  doc.uid = bcrypt.hashSync(doc.uid, Number(process.env.PASS_SECRET));
})

const User = mongoose.model('User', userSchema);

module.exports = User
