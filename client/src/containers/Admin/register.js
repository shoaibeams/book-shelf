import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { getUsers, userRegister } from '../../actions'

class Register extends PureComponent {

    state = {
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        error: '',
    }

    componentWillMount() {
        this.props.dispatch(getUsers())
    }

    handleInputEmail = (event) => {
        this.setState({ email: event.target.value })
    }

    handleInputPassword = (event) => {
        this.setState({ password: event.target.value })
    }

    handleInputFirstName = (event) => {
        this.setState({ firstname: event.target.value })
    }

    handleInputLastName = (event) => {
        this.setState({ lastname: event.target.value })
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.user.register === false) {
            this.setState({
                error: 'Error, try again!'
            })
        }
        else {
            this.setState({
                firstname: '',
                lastname: '',
                email: '',
                password: '',
                error: '',
            })
        }
    }


submitForm = (event) => {
    event.preventDefault();
    this.setState({ error: '' });
    this.props.dispatch(userRegister({
        email: this.state.email,
        password: this.state.password,
        firstname: this.state.firstname,
        lastname: this.state.lastname
    }, this.props.user.users))
}


showUsers = (user) => (
    user.users ?
        user.users.map(item => (
            <tr key={item._id}>
                <td>{item.firstname}</td>
                <td>{item.lastname}</td>
                <td>{item.email}</td>
            </tr>
        ))
        : null
)

render() {
    console.log(this.props);
    let user = this.props.user;
    return (
        <div className="rl_container">
            <form onSubmit={this.submitForm}>
                <h2>Add a new user.</h2>

                <div className="form_element">
                    <input type="text"
                        placeholder="Enter first name."
                        value={this.state.firstname}
                        onChange={this.handleInputFirstName}
                    />
                </div>

                <div className="form_element">
                    <input type="text"
                        placeholder="Enter Last Name."
                        value={this.state.lastname}
                        onChange={this.handleInputLastName}
                    />
                </div>

                <div className="form_element">
                    <input type="email"
                        placeholder="Enter Email."
                        value={this.state.email}
                        onChange={this.handleInputEmail}
                    />
                </div>

                <div className="form_element">
                    <input type="password"
                        placeholder="Enter Password."
                        value={this.state.password}
                        onChange={this.handleInputPassword}
                    />
                </div>

                <button type="submit"> Add User</button>
                <div className='error'></div>

            </form>

            <div className="current_users">
                <h4>Current Users:</h4>
                <table>
                    <thead>
                        <tr>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                        </tr>
                    </thead>

                    <tbody>
                        {this.showUsers(user)}
                    </tbody>
                </table>
            </div>
        </div>

    );
}
}

const mapStateToProps = (state, ownProps) => {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps)(Register);
