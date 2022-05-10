import styles from "../../css/Leaderboard.module.css";

export default function profiles({ Leaderboard }: any) {
  return <div id={styles.profile}>{Item(Leaderboard)}</div>;
}

function Item(data: any[]) {
  return (
    <>
      {data.map((value, index) => (
        <div className={styles.flex} key={index}>
          <div />
          <div className={styles.item}>
            <img src={value.img} alt="" />

            <div className={styles.info}>
              <h3 className={`${styles.name} ${styles.textDark}`}>
                {value.name}
              </h3>
              <span>{value.status}</span>
            </div>
          </div>
          <div />
          <div />
          <div />
          <div />
          <div className={styles.item}>
            <span>{value.elo}</span>
          </div>
          <div />
        </div>
      ))}
    </>
  );
}
