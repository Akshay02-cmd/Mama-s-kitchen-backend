const allRoles = {
  user: [
    "deleteContactUs",
    "getContactUs",
    "groupContactUsByUser",
    "deleteAllContactUs",
    "getAllContactUs",
  ],
  admin: [
    "getallMesses",
    "getMess",
    "deleteAllContactUs",
    "getAllContactUs",
    "getContactUsById",
    "GroupContactUsByUser",
    "deleteContactUs",
    "getallMeals",
  ],
  owner: [
    "getMess",
    "createMess",
    "updateMess",
    "deleteMess",
    "getallMeals",
    "createMeal",
    "updateMeal",
    "deleteMeal",
  ],
  customer: ["createContactUs", "getallMeals","getMeal"],
};

export default allRoles;
