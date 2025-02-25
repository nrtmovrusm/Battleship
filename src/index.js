import "./styles.css";
import { sum } from "./sum";

const body = document.querySelector("body");
body.append(sum(1, 2));
