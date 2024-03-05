<script setup>
import { db } from "../firebase/init.js";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { ref, onMounted } from "vue";

const birthdayCardCollection = collection(db, "birthdayCard");
const q = query(collection(db, "birthdayCard"), orderBy("date", "asc"));

const cards = ref([]);

onMounted(async () => {
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach(async (doc) => {
    console.log(doc.id, " => ", doc.data());
  });

  const BDcards = [];
  for (const doc of querySnapshot.docs) {
    const card = {
      id: doc.id,
      adminApprove: doc.data().adminApprove,
      amount: doc.data().amount,
      date: doc.data().date,
      flower_image: doc.data().flower_image,
      flower_name: doc.data().flower_name,
      sender_name: doc.data().sender_name,
      wish: doc.data().wish,
    };

    BDcards.push(card);
  }

  cards.value = BDcards;

  const awit_BDCard = await promise();
  cards.value = awit_BDCard;
});
</script>

<template>
  <div class="card-list">
    <div class="schedule" v-for="c in cards" :key="c">
      <div class="modal" v-if="c.adminApprove">
        <div class="recipe">
          <span class="recipe-shop-name">Goodpluming21ossom</span>
          <span class="recipe-shop-title">รายการคำสั่งซื้อของคุณ</span>
          <div class="recipe-flower">
            <span class="recipe-title">ดอกไม้</span>
            <span class="recipe-value">{{ c.flower_name }}</span>
          </div>
          <div class="recipe-flower">
            <span class="recipe-title">จำนวนดอกไม้ </span>
            <span class="recipe-value">{{ c.amount }}</span>
          </div>
          <div class="recipe-wish">
            <span class="recipe-title">ข้อความบนการ์ด </span>
            <span class="recipe-wish-title">{{ c.wish }}</span>
          </div>
          <div class="recipe-flower">
            <span class="recipe-title">ชื่อผู้ส่ง </span>
            <span class="recipe-value">{{ c.sender_name }}</span>
          </div>
          <div class="recipe-flower">
            <span class="recipe-title">adminApprove </span>
            <span class="recipe-value">{{ c.adminApprove }}</span>
          </div>

          <span class="recipe-shop-title"
            >----------------------------------</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.recipe {
  display: flex;
  flex-direction: column;
  justify-content: start;
  width: 350px;
  height: 500px;
  background-color: #ffffff;
  border-radius: 12px;
  border: #5ea9c9 solid 1px;
  padding: 20px;
}

.recipe-shop-name {
  color: #044560;
  font-family: Quicksand;
  font-size: 24px;
  font-weight: 700;
  padding: 20px 0px 10px 0px;
  text-align: center;
}

.recipe-shop-title {
  color: #044560;
  font-family: "IBM Plex Sans Thai";
  font-size: 14px;
  text-align: center;
  padding: 20px 0px;
}
.recipe-flower {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 5px 0px;
}

.recipe-title {
  color: #044560;
  font-family: "IBM Plex Sans Thai";
  font-size: 14px;
  font-weight: 700;
}

.recipe-value {
  color: #044560;
  font-family: "IBM Plex Sans Thai";
  font-size: 14px;
  font-weight: 500;
}

.recipe-wish {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: 5px 0px;
}

.recipe-wish-title {
  color: #044560;
  font-family: "IBM Plex Sans Thai";
  font-size: 14px;
  font-weight: 500;
  margin: 5px 0px;
}

.recipe-dateTime {
  color: #044560;
  font-family: "IBM Plex Sans Thai";
  font-size: 14px;
  font-weight: 500;
  margin: 20px 0px;
  text-align: center;
}

.order-complete {
  color: #044560;
  font-family: "IBM Plex Sans Thai";
  font-size: 24px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 10px;
}

.modal {
  padding: 20px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.schedule {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.card-list {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: start;
  flex-wrap: wrap;
  background-image: url("../assets/shopBackground.gif");
  min-height: 100vh;
  background-attachment: fixed;
  background-position: bottom 70px;
  background-repeat: no-repeat;
  background-size: cover;
}

.outline-button-select {
  background-color: transparent;
  color: #ffffff;
  background-color: #044560;
  border: 2px solid #044560;
  margin: 10px 0px;
  padding: 10px 40px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
  font-family: "IBM Plex Sans Thai";
  transition: background-color 0.3s ease, color 0.3s ease;
}
</style>
