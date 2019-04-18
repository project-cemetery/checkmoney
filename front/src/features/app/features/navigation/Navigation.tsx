import { useMappedState } from 'redux-react-hook'

import { Menu } from '@front/ui/components/controls/menu/Menu'
import { MenuItem } from '@front/ui/components/controls/menu/MenuItem'
import { pushRoute } from '@front/features/routing'
import { getUserIsManager } from '@front/domain/user/selectors/getUserIsManager'

interface Props {
  className?: string
}

export const Navigation = ({ className }: Props) => {
  const isManager = useMappedState(getUserIsManager)

  const defaultMenu = [
    <MenuItem key="home" id="home" selected>
      Home
    </MenuItem>,
    <MenuItem key="stats" id="stats" onClick={() => pushRoute('/app/stats')}>
      Stats
    </MenuItem>,
    <MenuItem
      key="history"
      id="history"
      onClick={() => pushRoute('/app/history')}
    >
      History
    </MenuItem>,
    <MenuItem
      key="profile"
      id="profile"
      onClick={() => pushRoute('/app/profile')}
    >
      Profile
    </MenuItem>,
  ]

  const managerMenu = isManager
    ? [
        <MenuItem
          key="manager"
          id="manager"
          onClick={() => pushRoute('/manager')}
        >
          Manager
        </MenuItem>,
      ]
    : []

  const menu = [...defaultMenu, ...managerMenu]

  return <Menu className={className}>{menu}</Menu>
}
