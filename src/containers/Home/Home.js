import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import * as authActions from 'redux/actions/auth'
import { amount } from '../../utils/amount'

import Alert from 'react-bootstrap/lib/Alert'

import { SendForm } from 'containers'
import { History } from 'containers'
import { Stats } from 'containers'

import classNames from 'classnames/bind'
import styles from './Home.scss'
const cx = classNames.bind(styles)

@connect(
  state => ({
    user: state.auth.user,
    verificationEmailSent: state.auth.verificationEmailSent,
    activeTab: state.auth.activeTab,
    verified: state.auth.verified,
  }),
  authActions)
export default class Home extends Component {
  static propTypes = {
    user: PropTypes.object,
    reload: PropTypes.func,

    // User verification
    params: PropTypes.object,
    resendVerificationEmail: PropTypes.func,
    verificationEmailSent: PropTypes.bool,
    verified: PropTypes.bool
  }

  static contextTypes = {
    config: PropTypes.object
  }

  state = {}

  reload = () => {
    this.props.reload({username: this.props.user.username})
  }

  handleDefaultPayment = () => {
    navigator.registerPaymentHandler('interledger', location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '') + '/widget')
  }

  resendVerification = (event) => {
    event.preventDefault()

    this.props.resendVerificationEmail(this.props.user.username)
  }

  toggleStats = (event) => {
    this.setState({
      ...this.state,
      showStats: !this.state.showStats
    })

    event.preventDefault()

    tracker.track('Toggle Stats')
  }

  render() {
    const { user, verified, verificationEmailSent } = this.props
    const { config } = this.context
    const { showStats } = this.state

    return (
      <div className="row">
        <div className="col-sm-8">
          {/* TODO:UX Invalid verification error */}
          {verified &&
          <Alert bsStyle="success">
            Your email has been verified!
          </Alert>}

          {/* Balance */}
          <div className="panel panel-default">
            <div className="panel-body">
              <div className={cx('balanceContainer')}>
                <div className={cx('balanceDescription')}>Your Balance</div>
                <div className={cx('balance')}>
                  {config.currencySymbol}{amount(user.balance)}
                  {config.reload && <span className={cx('but')}>*</span>}
                </div>
                {config.reload &&
                  <div>
                    <button className="btn btn-complete btn-lg" onClick={this.reload}>Get More</button>
                    <div className={cx('balanceFake')}>* Don't get too excited, this is fake money</div>
                  </div>}
              </div>
            </div>
          </div>
          {/* History */}
          <div className="panel panel-default">
            <div className="panel-heading">
              <div className="panel-title">
                {showStats &&
                <a href="" onClick={this.toggleStats}>Payment History</a>}
                {!showStats &&
                <span>Payment History</span>}
              </div>
              <div className="panel-title pull-right">
                {showStats &&
                <span>Stats</span>}
                {!showStats &&
                <a href="" onClick={this.toggleStats}>Stats</a>}
              </div>
            </div>
            <div className="panel-body">
              {!showStats && <History />}
              {showStats && <Stats />}
            </div>
          </div>
        </div>
        <div className="col-sm-4">
          {!user.email_verified &&
          <Alert bsStyle="danger">
            An email has been sent to <strong>{user.email}</strong>.
            Please follow the steps in the message to confirm your email address.&nbsp;
            {!verificationEmailSent && <a href="" onClick={this.resendVerification}>Resend the message</a>}
            {verificationEmailSent && <strong>Verification email sent!</strong>}
          </Alert>}
          {/*
          <div className="panel panel-default">
            <div className="panel-heading">
              <div className="panel-title">Use Five Bells Wallet as your default payment provider</div>
            </div>
            <div className="panel-body">
              <button className="btn btn-complete btn-block" onClick={this.handleDefaultPayment}>Set as default</button>
            </div>
          </div>
          */}
          <div className="panel panel-default">
            <div className="panel-heading">
              <div className="panel-title">Send Money</div>
            </div>
            <div className="panel-body">
              <SendForm />
            </div>
          </div>
        </div>
      </div>
    )
  }
}
