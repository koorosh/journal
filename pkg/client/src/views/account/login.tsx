import React, { ChangeEvent, useState } from 'react'
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
import Autocomplete from '@material-ui/lab/Autocomplete';

import { useOrganizations } from '../../hooks/use-organizations'
import { Organization } from '../../interfaces'
import loginUser from '../../core/login-user'

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

type FormData = {
  phone?: string
  password?: string
  organization?: Organization | null
}

export const Login = () => {
  const classes = useStyles()
  const [organizations] = useOrganizations()
  const [formData, setFormData] = useState<FormData>()
  const history = useHistory()

  const handleSubmit = async () => {
    if (!formData || !formData.phone || !formData.password || !formData.organization ) {
      return
    }

    const { phone, password, organization } = formData
    const isLoggedIn = await loginUser({
      phone,
      password,
      organizationId: organization?.id
    })

    if (isLoggedIn) {
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
          Sign in
        </Typography>
        <div className={classes.form}>
          <TextField
            onChange={e => setFormData({ ...formData, phone: e.target.value })}
            value={formData?.phone}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Номер телефону"
            name="phone"
            autoComplete="phone"
            autoFocus
          />
          <TextField
            onChange={e => setFormData({ ...formData, password: e.target.value })}
            value={formData?.password}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Пароль"
            type="password"
            autoComplete="current-password"
          />
          <Autocomplete
            options={organizations || []}
            getOptionLabel={option => option.name}
            onChange={(_e: ChangeEvent<{}>, organization: Organization | null) =>
              setFormData({
                ...formData,
                organization,
              })
            }
            value={formData?.organization || null}
            renderInput={params =>
              <TextField
                {...params}
                name="organization"
                label="Школа"
                variant="outlined"
                type="text"
                required
                margin="normal"
              />
            }
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={handleSubmit}
          >
            Увійти
          </Button>
        </div>
      </div>
    </Container>
  )
}