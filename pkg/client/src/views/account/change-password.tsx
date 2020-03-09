import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import {
  Button,
  TextField,
  Avatar,
  CssBaseline,
  Typography,
  Container
} from '@material-ui/core'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import { makeStyles } from '@material-ui/core/styles'

import changeUserPassword, { ChangeUserPasswordPayload } from '../../core/change-user-password'

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}))

export const ChangePassword = () => {
  const classes = useStyles()
  const [formData, setFormData] = useState<ChangeUserPasswordPayload>({
    password: '',
    newPassword: '',
    confirmPassword: '',
  })
  const history = useHistory()

  const handleSubmit = async () => {
    if (Object.values(formData).some(d => !d) ) {
      return
    }

    const isChanged = await changeUserPassword(formData)

    if (isChanged) {
      history.push('/today')
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline/>
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon/>
        </Avatar>
        <Typography component="h1" variant="h5">
          Змінити пароль
        </Typography>
        <div className={classes.form}>
          <TextField
            onChange={e => setFormData({ ...formData, password: e.target.value })}
            value={formData.password}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Пароль"
            type="password"
            name="password"
            autoFocus
          />
          <TextField
            onChange={e => setFormData({ ...formData, newPassword: e.target.value })}
            value={formData.newPassword}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="newPassword"
            label="Новий пароль"
            type="password"
          />
          <TextField
            onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
            value={formData.confirmPassword}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Підтвердити пароль"
            type="password"
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={handleSubmit}
          >
            Зберегти
          </Button>
        </div>
      </div>
    </Container>
  )
}