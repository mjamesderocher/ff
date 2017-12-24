import React, { Component } from 'react'
import firebase from 'firebase'
import { database } from '../functions/database'
import PostList from '../components/PostList'
import LoginButton from '../components/LoginButton'

export default class Index extends Component {
  static async getInitialProps ({req, query}) {
    const user = req && req.session ? req.session.decodedToken : null
    const role = req && req.session ? await database.getUserRole(user.user_id) : null
    const posts = await database.getCollection("post")
    return { user, posts, role }
  }

  constructor (props) {
    super(props)
    this.state = {
      role: this.props.role,
      user: this.props.user
    }
  }

  componentDidMount () {
    database.init();
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        database.getUserRole(user.uid)
            .then(a => this.setState({ user: user, role: a }))
        database.serverLogin(user)
      } else {
        this.setState({ user: null, role: null })
        database.serverLogout()
      }
    })
  }

  render () {
    const { user } = this.state
    return <div>
      <LoginButton user={user} />
      <PostList posts={this.props.posts} role={this.state.role} />
    </div>
  }
}
