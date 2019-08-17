/**
    Import Font Awesome icons
*/
import { library } from '@fortawesome/fontawesome-svg-core'

import {
    faCheckCircle,
    faSquare,
    faUser as faUserRegular
} from '@fortawesome/fontawesome-free-regular';

import {
    faPlus,
    faCheck,
    faUser as faUserSolid
} from '@fortawesome/fontawesome-free-solid';

library.add(
    faCheckCircle,
    faSquare,
    faCheck,
    faUserRegular,
    faUserSolid,
    faPlus
);
