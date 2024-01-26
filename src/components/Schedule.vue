<script setup>
import { db } from "../firebase/init.js";
import {
  collection,
  onSnapshot,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { ref, onMounted } from "vue";
import {
  getStorage,
  uploadBytesResumable,
  ref as storageRef,
  getDownloadURL,
} from "firebase/storage";

const scheduleCollection = collection(db, "schedule");
const queryScheduleCollcetion = query(
  scheduleCollection,
  orderBy("date", "desc")
);
const events = ref([]);
const showEditForm = ref(false);

const newEventName = ref("");
const newEventDate = ref("");
const newEventLocation = ref("");
const newEventDetail = ref("");
const newEventImage = ref();

// Add Event Schedule
const addEvent = async () => {
  const fileRef = storageRef(storage, `/images/${newEventImage.value.name}`);
  const upload = await uploadBytesResumable(fileRef, newEventImage.value);

  addDoc(scheduleCollection, {
    eventName: newEventName.value,
    eventDate: newEventDate.value,
    eventLocation: newEventLocation.value,
    eventDetail: newEventDetail.value,
    eventImage: `/images/${newEventImage.value.name}`,
    date: Date.now(),
  });
  newEventName.value = "";
  newEventDate.value = "";
  newEventLocation.value = "";
  newEventDetail.value = "";
  newEventImage.value = "";
};

const deleteEvent = (id) => {
  deleteDoc(doc(scheduleCollection, id));
};

const updateID = ref("");
const updateEventName = ref("");
const updateEventDate = ref("");
const updateEventLocation = ref("");
const updateEventDetail = ref("");
const updateEventImage = ref("");

const showFormEdit = (
  id,
  eventname,
  eventdate,
  eventlocation,
  eventdetail,
  eventimage
) => {
  showEditForm.value = true;
  updateID.value = id;

  updateEventName.value = eventname;
  updateEventDate.value = eventdate;
  updateEventLocation.value = eventlocation;
  updateEventDetail.value = eventdetail;
  updateEventImage.value = eventimage;
};

const updateEvent = (id) => {
  updateDoc(doc(scheduleCollection, id), {
    eventName: updateEventName.value,
    eventDate: updateEventDate.value,
    eventLocation: updateEventLocation.value,
    eventDetail: updateEventDetail.value,
    eventImage: updateEventImage.value,
  });
  showEditForm.value = false;
};

const storage = getStorage();

function handleChange(e) {
  const selectedFile = e.target.files[0];
  newEventImage.value = selectedFile;
  console.log("slected file successfully!");
}

onMounted(async () => {
  onSnapshot(queryScheduleCollcetion, async (querySnapshot) => {
    const promise = () => {
      return new Promise((resolve) => {
        const meenEvents = [];
        let index = 0;
        querySnapshot.forEach(async (doc) => {
          const imageRef = storageRef(storage, `${doc.data().eventImage}`);
          const url = await getDownloadURL(imageRef);
          const event = {
            id: doc.id,
            eventDate: doc.data().eventDate,
            eventDetail: doc.data().eventDetail,
            eventImage: url,
            eventLocation: doc.data().eventLocation,
            eventName: doc.data().eventName,
          };

          index++;

          meenEvents.push(event);
          if (querySnapshot.size === index) {
            console.log("meenEvents >>", meenEvents);
            resolve(meenEvents);
          }
        });
      });
    };
    const eventJa = await promise();
    console.log("eventJa >>", eventJa);
    events.value = eventJa;
  });
});
</script>

<template>
  <section id="schedule" class="event-schedule">
    <div class="schedule-card">
      <div class="schedule-title">Add Event Schedule</div>
      <div class="add-schedule">
        <form>
          <label for="fname">Event Name</label>
          <input
            type="text"
            id="fname"
            name="fname"
            placeholder="Enter Event Name"
            v-model="newEventName"
          />
          <label for="lname">Event Date</label>
          <input
            type="text"
            id="lname"
            name="lname"
            placeholder="Enter Event Date"
            v-model="newEventDate"
          />
          <label for="lname">Event Location</label>
          <input
            type="text"
            placeholder="Enter Event Location"
            v-model="newEventLocation"
          />
          <label for="lname">Event Link Detial</label>
          <input
            type="text"
            placeholder="Enter Event DateTime"
            v-model="newEventDetail"
          />
          <!-- <label for="lname">Event Link Image</label>
          <input type="datetime-local" v-model="newEventDateTime" />
          <span>{{ newEventDateTime }}</span> -->
          <input type="file" @change="handleChange" />
        </form>
        <q-btn
          outline
          label="Add Schedule"
          class="btn-add-schedule"
          target="_blank"
          @click="addEvent()"
        ></q-btn>
      </div>
      <div class="schedule-title">Meen's Event Schedule</div>
      <div class="schedule-list">
        <div class="schedule" v-for="event in events" :key="event">
          <img class="img-cover-event" :src="event.eventImage" alt="" />
          <div class="detail">
            <div class="title-group">
              <div class="event-name-and-btn">
                <div class="event-title">{{ event.eventName }}</div>
                <div class="btn-group-detail">
                  <q-btn
                    outline
                    label="Detail"
                    class="btn-detail"
                    href="https://www.facebook.com/cgm48official/posts/pfbid0dE3txyq3gXqcStNXjRpMYzfTFqZGB9sWwo9UQihZhcRxEosFSrVpYufUMFWuCWQHl"
                    target="_blank"
                  ></q-btn>
                </div>
              </div>
              <div class="date-and-location">
                <div class="event-date">
                  <div class="icon">
                    <box-icon
                      type="solid"
                      name="calendar-event"
                      size="sm"
                      color="#044560"
                    ></box-icon>
                  </div>
                  <div class="date-txt">{{ event.eventDate }}</div>
                </div>
                <div class="location">
                  <div class="icon">
                    <box-icon
                      name="map"
                      type="solid"
                      size="sm"
                      color="#044560"
                    ></box-icon>
                  </div>
                  <div class="location-txt">
                    {{ event.eventLocation }}
                  </div>
                </div>
                <div class="delete-and-update">
                  <q-btn
                    outline
                    label="Update"
                    class="btn-update"
                    target="_blank"
                    @click="
                      showFormEdit(
                        event.id,
                        event.eventName,
                        event.eventDate,
                        event.eventLocation,
                        event.eventDetail,
                        event.eventImage
                      )
                    "
                  ></q-btn>
                  <q-btn
                    outline
                    label="Delete"
                    class="btn-delete"
                    target="_blank"
                    @click="deleteEvent(event.id)"
                  ></q-btn>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="edit-schedule" v-if="showEditForm">
        <div class="schedule-title">Edit Event Schedule</div>
        <form>
          <label for="fname">Event Name</label>
          <input
            type="text"
            id="fname"
            name="fname"
            placeholder="Enter Event Name"
            v-model="updateEventName"
          />
          <label for="lname">Event Date</label>
          <input
            type="text"
            id="lname"
            name="lname"
            placeholder="Enter Event Date"
            v-model="updateEventDate"
          />
          <label for="lname">Event Location</label>
          <input
            type="text"
            id="lname"
            name="lname"
            placeholder="Enter Event Location"
            v-model="updateEventLocation"
          />
          <label for="lname">Event Link Detial</label>
          <input
            type="text"
            id="lname"
            name="lname"
            placeholder="Enter Event Link Detial"
            v-model="updateEventDetail"
          />
          <label for="lname">Event Link Image</label>
          <input
            type="text"
            id="lname"
            name="lname"
            placeholder="Enter Event Link Image"
            v-model="updateEventImage"
          />
        </form>
        <q-btn
          outline
          label="Update Schedule"
          class="btn-add-schedule"
          target="_blank"
          @click="updateEvent(updateID)"
        ></q-btn>
      </div>
    </div>
  </section>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Quicksand&display=swap");
@import url("https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai&display=swap");
.event-schedule {
  display: flex;
  justify-content: center;
  align-items: center;
  /* height: 100vh; */
}
.event-name-and-btn {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 340px;
}

.date-and-location {
  padding-top: 10px;
  padding-right: 10px;
}
.schedule-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.schedule-list {
  display: flex;
  flex-direction: row;
  justify-content: center;
  flex-wrap: wrap;
}

.schedule-title {
  margin-bottom: 20px;
  margin-top: 20px;
  flex-shrink: 0;
  color: #044560;
  font-family: Quicksand;
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
}

.schedule {
  width: 350px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px 10px 10px 10px;
  height: 550px;
}
.schedule:hover {
  box-shadow: #fde9ff 0px 8px 24px;
}
.img-cover-event {
  width: 350px;
  height: 350px;
  background-size: cover;
  background-position: center;
  border-radius: 20px;
}

.detail {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 350px;
  padding: 20px 5px 20px 5px;
}

.event-date {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.location {
  display: flex;
  flex-direction: row;
  align-items: start;
}

.event-title {
  color: #044560;
  font-family: "IBM Plex Sans Thai";
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  padding: 0px 0px 0px 10px;
  display: flex;
  align-items: center;
  padding-right: 10px;
}

.date-txt,
.location-txt {
  color: #044560;
  font-family: "IBM Plex Sans Thai";
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
}
.icon {
  margin-right: 5px;
  margin-left: 10px;
}

.btn-group-detail {
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
  margin: 0px 10px 0px 0px;
}

.btn-detail {
  color: #044560;
  font-family: Quicksand;
  font-weight: 700;
  padding: 0px 20px 0px 20px;
}

.btn-delete {
  color: #ff0000;
  font-family: Quicksand;
  font-weight: 700;
  padding: 0px 20px 0px 20px;
  margin-left: 10px;
}

.btn-update {
  color: #5f42ff;
  font-family: Quicksand;
  font-weight: 700;
  padding: 0px 20px 0px 20px;
  margin-left: 10px;
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

.btn-add-schedule {
  font-family: Quicksand;
  font-weight: 700;
  padding: 10px 20px 10px 20px;
  width: 200px;
  margin: 20px 20px;
}

.add-schedule {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.edit-schedule {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.input-data {
  margin: 5px 0px 5px 0px;
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
</style>
