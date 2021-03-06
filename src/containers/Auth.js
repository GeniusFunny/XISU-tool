import React from 'react'
import {View, ImageBackground, AsyncStorage} from 'react-native'
import {connect} from 'react-redux'
import {TextInput, Button, Snackbar, Title} from 'react-native-paper'
import {login} from '../constants/login'
import {withNavigation} from 'react-navigation'
import Spinner from 'react-native-loading-spinner-overlay'
import WithStore from './WithStore'
import store from '../stores/login'
import {WIDTH, HEIGHT} from '../config'

const styles = {
  root: {
    width: WIDTH,
    height: HEIGHT,
    justifyContent: 'center'
  },
  form: {
    title: {
      alignItems: 'center',
      paddingBottom: 30
    },
    body: {
      padding: 20,
      marginBottom: 15
    },
    firstInput: {
      backgroundColor: 'transparent',
      marginBottom: 20
    },
    input: {
      backgroundColor: 'transparent',
    }
  },
  buttonContainer: {
    paddingLeft: 100,
    paddingRight: 100
  }
}
class Auth extends React.Component {
  state = {
    username: '',
    password: '',
    snackBarVisible: false,
    visible: false
  }
  componentDidMount() {
    setImmediate(async () => {
      let username = await this._fetchUser()
      this.setState({
        username: username
      })
    })
  }
  shouldComponentUpdate(nextProps) {
    if (nextProps.login) {
      this._storeUser(this.state.username)
      nextProps.navigation.navigate('Explore')
    }
    return true
  }
  _handleTextChange = (name, value) => {
    this.setState({
      [name]: value
    })
  }
  _storeUser = async (username) => {
    try {
      await AsyncStorage.setItem('username', username)
    } catch (e) {
      console.log(e)
    }
  }
  _fetchUser = async () => {
    try {
      return await AsyncStorage.getItem('username')
    } catch (e) {
      console.log(e)
    }
  }
  _login = () => {
    const {dispatch} = this.props
    const {password, username} = this.state
    if (password.length && username.length) {
      dispatch(login(this.state.username, this.state.password))
    } else {
      this.setState({
        visible: true
      })
    }
  }
  render() {
    return (
      <ImageBackground source={{uri: 'http://img.hb.aicdn.com/de1470abfd62e4ac954037320a954469fb6266d94dec3-q0jKuC_fw658'}} style={styles.root}>
        <Spinner
          textContent={'login...'}
          visible={this.props.loading}
        />
        <Snackbar visible={this.props.error} onDismiss={() => this.setState({snackBarVisible: false})}>
          {this.props.errMessage}
        </Snackbar>
        <Snackbar visible={this.state.visible} onDismiss={() => this.setState({visible: false})}>
          请输入正确的用户名及密码
        </Snackbar>
        <View style={styles.form.title}>
          <Title>
            Hi, Welcome back.
          </Title>
        </View>
        <View style={styles.form.body}>
          <TextInput
            label={'ID'}
            keyboardType={'numeric'}
            maxLength={18}
            value={this.state.username}
            onChangeText={text => this._handleTextChange('username', text)}
            style={styles.form.firstInput}
          />
          <TextInput
            label={'Password'}
            secureTextEntry={true}
            maxLength={16}
            value={this.state.password}
            onChangeText={text => this._handleTextChange('password', text)}
            style={styles.form.input}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            onPress={() => this._login()}
            mode={'contained'}
          >
            Login
          </Button>
        </View>
      </ImageBackground>
    )
  }
}
const mapStateToProps = (state) => {
  const {loading, error, errMessage, login, data} = state
  return {
    loading: loading,
    error: error,
    errMessage: errMessage,
    login: login,
    data: data
  }
}
export default WithStore(connect(mapStateToProps)(withNavigation(Auth)), store)
