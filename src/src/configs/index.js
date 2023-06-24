import Authentication from '@features/authentication';
import APP_TEXT from '@assets/locale/en';
import images from '@assets/images';
import Home from '@features/home';
import Portfolio from '@features/portfolio';
import Profile from '@features/profile';
import Invest from '@features/invest';
import Rewards from '@features/rewards';

//Bottom Tab Options
export const BottomTabConfig = [
  {
    id: 0,
    name: 'Home',
    screen: Home,
    icon: images.home_icon,
  },
  {
    id: 1,
    name: 'Invest',
    screen: Invest,
    icon: images.invest_icon,
  },
  {
    id: 2,
    name: 'Portfolio',
    screen: Portfolio,
    icon: images.portfolio_icon,
  },
  {
    id: 3,
    name: 'Rewards',
    screen: Rewards,
    icon: images.rewards_icon,
  },
  {
    id: 3,
    name: 'Profile',
    screen: Profile,
    icon: images.profile_icon,
  },
];
