<script setup>
import { db } from "../firebase/init.js";
import { addDoc, collection, onSnapshot } from "firebase/firestore";
import { ref, onMounted } from "vue";
import "boxicons";
import {
  getStorage,
  uploadBytesResumable,
  ref as storageRef,
  getDownloadURL,
} from "firebase/storage";

const reccomendedFoodCollection = collection(db, "reccomendedFood");
const storage = getStorage();

const shopList = ref([]);

// add shop feild
const newShopName = ref("");
const newShopDetail = ref("");
const newMenuSignature = ref("");
const newMenuPrice = ref("");
const newBranch = ref("");
const newShopImage = ref();

// add shop recommended
const addReccomendedFood = async () => {
  const fileRef = storageRef(storage, `/images/${newShopImage.value.name}`);
  const upload = await uploadBytesResumable(fileRef, newShopImage.value);

  // When the image has been uploaded...
  addDoc(reccomendedFoodCollection, {
    shopName: newShopName.value,
    shopDetails: newShopDetail.value,
    menuSignature: newMenuSignature.value,
    menuPrice: newMenuPrice.value,
    allShopBranchs: newBranch.value,
    UrlImage: `/images/${newShopImage.value.name}`,
  });
};

// select file to upload
function handleChange(e) {
  const selectedFile = e.target.files[0];
  newShopImage.value = selectedFile;
}

onMounted(async () => {
  onSnapshot(reccomendedFoodCollection, async (querySnapshot) => {
    const promise = () => {
      return new Promise((resolve) => {
        const shops = [];
        let index = 0;
        querySnapshot.forEach(async (doc) => {
          const imageRef = storageRef(storage, `${doc.data().UrlImage}`);
          const url = await getDownloadURL(imageRef);
          const shop = {
            id: doc.id,
            allShopBranchs: doc.data().allShopBranchs,
            menuPrice: doc.data().menuPrice,
            menuSignature: doc.data().menuSignature,
            shopDetails: doc.data().shopDetails,
            shopImage: doc.data().shopImage,
            shopName: doc.data().shopName,
            UrlImage: url,
          };

          index++;

          shops.push(shop);
          if (querySnapshot.size === index) {
            console.log("shops >>", shops);
            resolve(shops);
          }
        });
      });
    };
    const shopJa = await promise();
    console.log("shopJa >>", shopJa);
    shopList.value = shopJa;
  });
});
</script>

<template>
  <section id="recommended-food">
    <div class="add-recommend-food">
      <div class="add-recommended-food-title">Add Recommened Food</div>
      <form>
        <label for="fname">Shop Name</label>
        <input
          name="fname"
          placeholder="Enter Shop Name"
          v-model="newShopName"
        />
        <label for="lname">Shop Detail</label>
        <input
          type="text"
          placeholder="Enter Shop Detail"
          v-model="newShopDetail"
        />
        <label for="lname">Menu Signature</label>
        <input
          type="text"
          placeholder="Enter Menu Signature"
          v-model="newMenuSignature"
        />
        <label for="lname">Menu Price</label>
        <input
          type="text"
          placeholder="Enter Menu Price"
          v-model="newMenuPrice"
        />
        <label for="lname">Link Shop Branch</label>
        <input
          type="text"
          placeholder="Enter Link Shop Branch"
          v-model="newBranch"
        />
        <input type="file" @change="handleChange" />
        <q-btn
          outline
          label="Add Schedule"
          class="btn-add-schedule"
          target="_blank"
          @click="addReccomendedFood()"
        ></q-btn>
      </form>
    </div>
    <div class="container">
      <div class="recommended-title">น้องมีนพากิน</div>
      <div class="sub-recommended-title">
        เมนูนี้น้องมีนแนะนำ ไปตำด่วนมันอร่อยมาก!
      </div>

      <div class="recommended-list">
        <div class="recommended-card" v-for="shop in shopList" :key="shop">
          <img class="menu-image" :src="shop.UrlImage" alt="" />

          <div class="menu-details">
            <div class="shop-name">{{ shop.shopName }}</div>
            <div class="shop-detail">
              {{ shop.shopDetails }}
            </div>
            <div class="detail-and-icon">
              <box-icon
                type="solid"
                name="star"
                size="sm"
                color="#044560"
              ></box-icon>
              <span class="menu-signature">{{ shop.menuSignature }}</span>
            </div>
            <div class="detail-and-icon">
              <box-icon name="money" size="sm" color="#044560"></box-icon>
              <span class="menu-detail-list">{{ shop.menuPrice }}</span>
            </div>
            <div class="detail-and-icon">
              <box-icon
                name="map"
                type="solid"
                size="sm"
                color="#044560"
              ></box-icon>

              <a
                class="menu-detail-list"
                :href="shop.allShopBranchs"
                target="_blank"
                >สาขาทั้งหมด</a
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 60px 60px;
}
.recommended-title {
  flex-shrink: 0;
  color: #044560;
  font-family: "IBM Plex Sans Thai";
  font-size: 40px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
}

.sub-recommended-title {
  flex-shrink: 0;
  color: #044560;
  font-family: "IBM Plex Sans Thai";
  font-size: 22px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
}

.recommended-list {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 20px 0px 0px 0px;
}

.recommended-card {
  margin-bottom: 20px;
  display: flex;
  flex-direction: row;
  border-radius: 20px;
  background-color: rgb(255, 255, 255);
  max-width: 800px;
}

.recommended-card:hover {
  box-shadow: #cde2eb 0px 8px 24px;
}

.menu-image {
  border-radius: 20px 0px 0px 20px;
  width: 200px;
  height: 300px;
  object-fit: cover;
}

.menu-details {
  padding: 20px 20px 20px 20px;
  width: 600px;
}

.shop-name {
  color: #044560;
  font-family: "IBM Plex Sans Thai";
  font-size: 30px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  margin-bottom: 0px;
}

.shop-detail {
  color: #044560;
  font-family: "IBM Plex Sans Thai";
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  padding-bottom: 10px;
}

.detail-and-icon {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 3px 0px 3px 0px;
}

.menu-detail-list {
  color: #044560;
  font-family: "IBM Plex Sans Thai";
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  padding-left: 10px;
}

.menu-signature {
  color: #044560;
  font-family: "IBM Plex Sans Thai";
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  padding-left: 10px;
}

.add-recommend-food {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

form {
  display: flex;
  flex-direction: column;
  width: 500px;
}

input {
  width: 100%;
  padding: 10px 8px;
  margin: 8px 0;
  box-sizing: border-box;
}

.add-recommended-food-title {
  margin-bottom: 10px;
  margin-top: 20px;
  flex-shrink: 0;
  color: #044560;
  font-family: Quicksand;
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
}

label {
  font-family: Quicksand;
  font-weight: 700;
  color: #044560;
}

input::placeholder {
  font-family: Quicksand;
  font-weight: 700;
  color: #044560;
  opacity: 50%;
}

/* Ipad size */
@media screen and (max-width: 1024px) {
  .recommended-card {
    max-width: 750px;
  }

  .menu-details {
    width: 500px;
  }
}
/* Mobile size */
@media screen and (max-width: 480px) {
  .container {
    padding: 60px 0px 60px 0px;
  }
  .recommended-card {
    max-width: 100%;
  }

  .menu-image {
    width: 170px;
    height: 260px;
  }

  .shop-name {
    margin-bottom: 5px;
    font-size: 18px;
  }

  .shop-detail {
    font-size: 14px;
    padding-bottom: 5px;
  }

  .menu-detail-list {
    font-size: 14px;
  }

  .menu-signature {
    font-size: 14px;
    padding-left: 3px;
  }
  .menu-details {
    width: 200px;
    padding: 10px 10px 0px 10px;
  }

  .recommended-title {
    font-size: 30px;
  }

  .sub-recommended-title {
    font-size: 18px;
  }

  .menu-detail-list {
    padding-left: 3px;
  }

  .detail-and-icon {
    padding: 2px 0px 2px 0px;
  }
}
</style>