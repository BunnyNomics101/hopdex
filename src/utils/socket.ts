import { io } from "socket.io-client";
import {API_URL} from '../config/index'

const socket = io(API_URL);

export default socket ; 