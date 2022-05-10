import Button from "../../components/Button";
import styles from "../../css/Profile.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCirclePlus,
  faMessage,
  faBan,
  faRankingStar,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function profiles({ Data }: any) {
  return <div id={styles.profile}>{Item(Data)}</div>;
}

function Item(data: any[]) {
  console.log(data);
  return (
    <>
      {data.map((value, index) => {
        return (
          <div className={styles.flex} key={index}>
            <div className={styles.item}>
              <img src={value.picture} alt="" />

              <div className={styles.info}>
                <Link to={"/Profile/" + value.ft_id}>
                  <h3 className={`${styles.name} ${styles.textDark}`}>
                    {value.username}
                  </h3>
                </Link>
                <span>{value.status}</span>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}