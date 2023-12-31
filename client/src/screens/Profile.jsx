import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, SafeAreaView, ImageBackground, ScrollView, View, Image, Pressable, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import bg from "../../assets/image/bg-home.png";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import NavIcon from "../components/NavIcon";
import { addProfile, editProfile, getUser } from "../../store/actions";
import * as ImagePicker from "expo-image-picker";
import { errorAlert, successAlert } from "../helpers/alert";
import { useFocusEffect } from "@react-navigation/native";
import { fPrice } from "../helpers/fPrice";
import { generateStars } from "../helpers/fRating";
import { fDate } from "../helpers/fDate";

function Profile({ navigation }) {
  const { profile, loading } = useSelector((state) => state.userReducer);
  const { myVehicles } = useSelector((state) => state.vehicleReducer);
  const { userReviews } = useSelector((state) => state.reviewReducer);
  const [toggleEdit, setToggleEdit] = useState(false);
  const [inputProfileImage, setInputProfileImage] = useState(null);
  const [inputKtpImage, setInputKtpImage] = useState(null);
  const [inputSIMAImage, setInputSIMAImage] = useState(null);
  const [inputSIMCImage, setInputSIMCImage] = useState(null);
  const dispatch = useDispatch();
  const [review, setReview] = useState(false);

  const selectImage = async (setImageFunction) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageFunction(result.assets[0].uri);
    }
    setToggleEdit(true);
  };

  const selectProfileImage = () => {
    selectImage(setInputProfileImage);
  };

  const selectKTPImage = () => {
    selectImage(setInputKtpImage);
  };

  const selectSIMAImage = () => {
    selectImage(setInputSIMAImage);
  };

  const selectSIMCImage = () => {
    selectImage(setInputSIMCImage);
  };

  const cancelSave = () => {
    setInputKtpImage(false);
    setInputProfileImage(false);
    setInputSIMAImage(false);
    setInputSIMCImage(false);
    setToggleEdit(false);
  };

  const submitProfile = async () => {
    const access_token = await AsyncStorage.getItem("access_token");
    const formData = new FormData();
    if (inputProfileImage) {
      formData.append("profilePicture", {
        name: "profilePicture.jpg",
        type: "image/jpeg",
        uri: inputProfileImage,
      });
    } else {
      formData.append("profilePicture", {
        name: "profilePicture.jpg",
        type: "image/jpeg",
        uri: profile.UserProfile.profilePicture,
      });
    }

    if (inputKtpImage) {
      formData.append("ktp", {
        name: "ktp.jpg",
        type: "image/jpeg",
        uri: inputKtpImage,
      });
    } else {
      formData.append("ktp", {
        name: "ktp.jpg",
        type: "image/jpeg",
        uri: profile.UserProfile.ktp,
      });
    }
    if (inputSIMAImage) {
      formData.append("simA", {
        name: "simA.jpg",
        type: "image/jpeg",
        uri: inputSIMAImage,
      });
    }
    if (inputSIMCImage) {
      formData.append("simC", {
        name: "simC.jpg",
        type: "image/jpeg",
        uri: inputSIMCImage,
      });
    }

    if (profile.UserProfile?.profilePicture) {
      //edit
      dispatch(editProfile(formData, access_token))
        .then((data) => {
          setToggleEdit(false);
          successAlert(data.message);
        })
        .catch((error) => {
          errorAlert(error.message);
        });
    } else {
      dispatch(addProfile(formData, access_token))
        .then((data) => {
          setToggleEdit(false);
          successAlert(data.message);
        })
        .catch((error) => {
          console.log(error, "disini");
          errorAlert(error.message);
        });
    }
  };

  function addNewlineEvery100Chars(inputString) {
    const chunkSize = 48;
    let result = "";
    for (let i = 0; i < inputString.length; i += chunkSize) {
      result += inputString.substring(i, i + chunkSize) + "\n";
    }
    return result;
  }

  const CardReview = (review) => {
    const { rating, message, createdAt, Vehicle } = review.review;

    return (
      <View style={{ backgroundColor: "white", elevation: 2, shadowColor: "black", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 3, width: "100%", padding: 20 }}>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <Image source={{ uri: Vehicle ? Vehicle.image : "https://www.copaster.com/wp-content/uploads/2023/03/pp-kosong-wa-default.jpeg" }} style={{ width: 30, height: 30, borderRadius: 50 }} />
          <View style={{ gap: 5 }}>
            <Text style={{ fontSize: 12, fontWeight: "700" }}>{Vehicle?.name}</Text>
            <Text>{generateStars(Math.round(rating * 2) / 2)}</Text>
            <Text style={{ fontSize: 10 }}>{fDate(createdAt)}</Text>
            <Text style={{ fontSize: 13, marginVertical: 7 }}>{addNewlineEvery100Chars(message)}</Text>
          </View>
        </View>
      </View>
    );
  };

  useFocusEffect(
    useCallback(() => {
      dispatch(getUser());
    }, [])
  );

  return (
    <View style={styles.container}>
      <NavIcon />
      <View
        style={{
          position: "absolute",
          top: 70,
          left: 20,
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
        }}
      >
        <Pressable onPress={() => navigation.navigate("You")}>
          <Ionicons name="arrow-back-sharp" size={24} color="white" />
        </Pressable>
        <Text style={{ color: "white", fontSize: 20 }}>{profile?.fullName}</Text>
      </View>
      <SafeAreaView style={{ flex: 1 }}>
        <ImageBackground source={bg} style={{ flex: 1 }}>
          <ScrollView style={styles.scrollViewContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.itemContainer}>
              <View style={styles.top}></View>

              {/* profile */}

              <View style={styles.profileContainer}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 15,
                  }}
                >
                  {inputProfileImage ? (
                    <View>
                      <Image
                        source={{
                          uri: inputProfileImage,
                        }}
                        style={styles.profileImage}
                      />
                      <Pressable
                        style={{
                          marginTop: 10,
                          marginStart: 5,
                          flexDirection: "row",
                          gap: 2,
                          alignItems: "center",
                        }}
                        onPress={selectProfileImage}
                      >
                        <Feather name="edit-3" size={15} color="gray" />
                        <Text style={{ fontSize: 12, color: "gray" }}>Edit Photo</Text>
                      </Pressable>
                    </View>
                  ) : (
                    profile && (
                      <View>
                        <Image
                          source={{
                            uri: profile.UserProfile ? `${profile.UserProfile.profilePicture}` : "https://www.copaster.com/wp-content/uploads/2023/03/pp-kosong-wa-default.jpeg",
                          }}
                          style={styles.profileImage}
                        />
                        <Pressable
                          style={{
                            marginTop: 10,
                            marginStart: 5,
                            flexDirection: "row",
                            gap: 2,
                            alignItems: "center",
                          }}
                          onPress={selectProfileImage}
                        >
                          <Feather name="edit-3" size={15} color="gray" />
                          <Text style={{ fontSize: 12, color: "gray" }}>Edit Photo</Text>
                        </Pressable>
                      </View>
                    )
                  )}

                  <View style={{ marginTop: -20, flex: 6 }}>
                    <Text style={styles.profileName}>{profile ? profile.fullName : ""}</Text>
                    <View style={{ gap: 2 }}>
                      <Text style={{ fontSize: 15 }}>{profile && profile.totalAmount ? fPrice(profile.totalAmount) : "Rp 0"}</Text>
                      <Text style={styles.profileInfo}>{profile ? profile.email : ""}</Text>
                      {profile && profile.Orders && <Text style={styles.profileInfo}>{profile ? profile.Orders.length : 0} Orders</Text>}
                    </View>
                  </View>
                  {toggleEdit && (
                    <View
                      style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        flexDirection: "row",
                        gap: 3,
                      }}
                    >
                      <Pressable
                        style={{
                          backgroundColor: "red",
                          padding: 5,
                          paddingHorizontal: 5,
                          borderRadius: 5,
                        }}
                        onPress={cancelSave}
                      >
                        <Text style={{ fontSize: 13, color: "white" }}>Cancel</Text>
                      </Pressable>
                      <Pressable
                        onPress={submitProfile}
                        style={{
                          backgroundColor: "#17799A",
                          padding: 5,
                          paddingHorizontal: 10,
                          borderRadius: 5,
                        }}
                      >
                        <Text style={{ fontSize: 13, color: "white" }}>Save</Text>
                      </Pressable>
                    </View>
                  )}
                </View>
                <View style={{ flexDirection: "row", marginTop: 10 }}>
                  <View
                    style={{
                      flex: 1,
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 5,
                    }}
                  >
                    <Text style={{ fontSize: 18, fontWeight: 700 }}>{myVehicles.length}</Text>
                    <Text style={{ fontSize: 12, color: "gray", fontWeight: 600 }}>Vehicles</Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 5,
                    }}
                  >
                    <Text style={{ fontSize: 18, fontWeight: 700 }}>{profile.Orders.length}</Text>
                    <Text style={{ fontSize: 12, color: "gray", fontWeight: 600 }}>Orders</Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 5,
                    }}
                  >
                    <Text style={{ fontSize: 18, fontWeight: 700 }}>{userReviews.length}</Text>
                    <Text style={{ fontSize: 12, color: "gray", fontWeight: 600 }}>Reviews</Text>
                  </View>
                </View>
              </View>

              {/* end profile */}
              <View style={{ paddingHorizontal: 20, paddingBottom: 20 }}>
                <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
                  <Pressable
                    onPress={() => {
                      setReview(false);
                    }}
                  >
                    <View style={{ borderBottomColor: !review ? "#17799A" : "whitesmoke", paddingVertical: 5, borderBottomWidth: !review ? 2 : 0, width: 70 }}>
                      <Text style={{ color: "black", fontSize: 13, textAlign: "center" }}>Document</Text>
                    </View>
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      setReview(true);
                    }}
                  >
                    <View style={{ borderBottomColor: review ? "#17799A" : "whitesmoke", paddingVertical: 5, borderBottomWidth: review ? 2 : 0, width: 70 }}>
                      <Text style={{ color: "black", fontSize: 13, textAlign: "center" }}>Reviews</Text>
                    </View>
                  </Pressable>
                </View>
              </View>

              {/* document */}
              <ScrollView>
                {loading ? (
                  <View
                    style={[
                      styles.itemsContainer,
                      {
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 3,
                        marginTop: 50,
                      },
                    ]}
                  >
                    <ActivityIndicator size="large" />
                    <Text style={{ marginTop: 16, fontSize: 18, zIndex: 3 }}>Loading...</Text>
                  </View>
                ) : !review ? (
                  <View style={styles.itemsContainer}>
                    {/* ktp */}
                    <View style={styles.itemsBackgroundContainer}>
                      <View style={{ gap: 2 }}>
                        <Text style={styles.itemsDetailTitle}>ID Card</Text>
                        <Text style={styles.itemsDetailInfo}>An official document that proves a person's identity.</Text>
                        {!inputKtpImage ? (
                          <View style={styles.documentContainer}>
                            {profile && profile.UserProfile && profile.UserProfile.ktp ? (
                              <>
                                <View
                                  style={{
                                    borderColor: "rgba(0, 0, 0, 0.2)",
                                    borderWidth: 2,
                                    borderRadius: 10,
                                    padding: 5,
                                  }}
                                >
                                  <Image
                                    source={{ uri: profile.UserProfile.ktp }}
                                    style={{
                                      width: 150,
                                      height: 90,
                                      borderRadius: 10,
                                    }}
                                    resizeMode="contain"
                                  />
                                </View>
                                <Pressable
                                  style={{
                                    marginStart: 15,
                                    flexDirection: "row",
                                    gap: 2,
                                    alignItems: "flex-end",
                                    marginBottom: 5,
                                  }}
                                  onPress={selectKTPImage}
                                >
                                  <Feather name="edit-3" size={15} color="gray" />
                                  <Text style={{ fontSize: 12, color: "gray" }}>Edit ID Card</Text>
                                </Pressable>
                              </>
                            ) : (
                              <Pressable
                                style={{
                                  flexDirection: "row",
                                  gap: 2,
                                  alignItems: "flex-end",
                                  marginBottom: 5,
                                }}
                                onPress={selectKTPImage}
                              >
                                <Feather name="edit-3" size={15} color="gray" />
                                <Text style={{ fontSize: 12, color: "gray" }}>Add ID Card</Text>
                              </Pressable>
                            )}
                          </View>
                        ) : (
                          <View style={styles.documentContainer}>
                            <View
                              style={{
                                borderColor: "rgba(0, 0, 0, 0.2)",
                                borderWidth: 2,
                                borderRadius: 10,
                                padding: 5,
                              }}
                            >
                              <Image
                                source={{ uri: inputKtpImage }}
                                style={{
                                  width: 150,
                                  height: 90,
                                  borderRadius: 10,
                                }}
                                resizeMode="contain"
                              />
                            </View>
                            <Pressable
                              style={{
                                marginStart: 15,
                                flexDirection: "row",
                                gap: 2,
                                alignItems: "flex-end",
                                marginBottom: 5,
                              }}
                              onPress={selectKTPImage}
                            >
                              <Feather name="edit-3" size={15} color="gray" />
                              <Text style={{ fontSize: 12, color: "gray" }}>Edit ID Card</Text>
                            </Pressable>
                          </View>
                        )}
                      </View>
                    </View>
                    {/* end ktp */}

                    {/* sim A */}
                    <View style={styles.itemsBackgroundContainer}>
                      <View style={{ gap: 2 }}>
                        <Text style={styles.itemsDetailTitle}>SIM A</Text>
                        <Text style={styles.itemsDetailInfo}>Indonesian driver's license that allows you to drive cars.</Text>
                        {!inputSIMAImage ? (
                          <View style={styles.documentContainer}>
                            {profile.UserProfile && profile.UserProfile.simA ? (
                              <>
                                <View
                                  style={{
                                    borderColor: "rgba(0, 0, 0, 0.2)",
                                    borderWidth: 2,
                                    borderRadius: 10,
                                    padding: 5,
                                  }}
                                >
                                  <Image
                                    source={{ uri: profile.UserProfile.simA }}
                                    style={{
                                      width: 150,
                                      height: 90,
                                      borderRadius: 10,
                                    }}
                                    resizeMode="contain"
                                  />
                                </View>
                                <Pressable
                                  style={{
                                    marginStart: 15,
                                    flexDirection: "row",
                                    gap: 2,
                                    alignItems: "flex-end",
                                    marginBottom: 5,
                                  }}
                                  onPress={selectSIMAImage}
                                >
                                  <Feather name="edit-3" size={15} color="gray" />
                                  <Text style={{ fontSize: 12, color: "gray" }}>Edit SIM A</Text>
                                </Pressable>
                              </>
                            ) : (
                              <Pressable
                                style={{
                                  flexDirection: "row",
                                  gap: 2,
                                  alignItems: "flex-end",
                                  marginBottom: 5,
                                }}
                                onPress={selectSIMAImage}
                              >
                                <Feather name="edit-3" size={15} color="gray" />
                                <Text style={{ fontSize: 12, color: "gray" }}>Add SIM A</Text>
                              </Pressable>
                            )}
                          </View>
                        ) : (
                          <View style={styles.documentContainer}>
                            <View
                              style={{
                                borderColor: "rgba(0, 0, 0, 0.2)",
                                borderWidth: 2,
                                borderRadius: 10,
                                padding: 5,
                              }}
                            >
                              <Image
                                source={{ uri: inputSIMAImage }}
                                style={{
                                  width: 150,
                                  height: 90,
                                  borderRadius: 10,
                                }}
                                resizeMode="contain"
                              />
                            </View>
                            <Pressable
                              style={{
                                marginStart: 15,
                                flexDirection: "row",
                                gap: 2,
                                alignItems: "flex-end",
                                marginBottom: 5,
                              }}
                              onPress={selectSIMAImage}
                            >
                              <Feather name="edit-3" size={15} color="gray" />
                              <Text style={{ fontSize: 12, color: "gray" }}>Edit SIM A</Text>
                            </Pressable>
                          </View>
                        )}
                      </View>
                    </View>
                    {/* end sim A */}

                    {/* sim C */}
                    <View style={styles.itemsBackgroundContainer}>
                      <View style={{ gap: 2 }}>
                        <Text style={styles.itemsDetailTitle}>SIM C</Text>
                        <Text style={styles.itemsDetailInfo}>Indonesian driver's license for riding motorcycles.</Text>
                        <View style={styles.documentContainer}>
                          {!inputSIMCImage ? (
                            <View style={styles.documentContainer}>
                              {profile && profile.UserProfile && profile.UserProfile.simC ? (
                                <>
                                  <View
                                    style={{
                                      borderColor: "rgba(0, 0, 0, 0.2)",
                                      borderWidth: 2,
                                      borderRadius: 10,
                                      padding: 5,
                                    }}
                                  >
                                    <Image
                                      source={{
                                        uri: profile.UserProfile.simC,
                                      }}
                                      style={{
                                        width: 150,
                                        height: 90,
                                        borderRadius: 10,
                                      }}
                                      resizeMode="contain"
                                    />
                                  </View>
                                  <Pressable
                                    style={{
                                      marginStart: 15,
                                      flexDirection: "row",
                                      gap: 2,
                                      alignItems: "flex-end",
                                      marginBottom: 5,
                                    }}
                                    onPress={selectSIMCImage}
                                  >
                                    <Feather name="edit-3" size={15} color="gray" />
                                    <Text style={{ fontSize: 12, color: "gray" }}>Edit SIM C</Text>
                                  </Pressable>
                                </>
                              ) : (
                                <Pressable
                                  style={{
                                    flexDirection: "row",
                                    gap: 2,
                                    alignItems: "flex-end",
                                    marginBottom: 5,
                                  }}
                                  onPress={selectSIMCImage}
                                >
                                  <Feather name="edit-3" size={15} color="gray" />
                                  <Text style={{ fontSize: 12, color: "gray" }}>Add SIM C</Text>
                                </Pressable>
                              )}
                            </View>
                          ) : (
                            <View style={styles.documentContainer}>
                              <View
                                style={{
                                  borderColor: "rgba(0, 0, 0, 0.2)",
                                  borderWidth: 2,
                                  borderRadius: 10,
                                  padding: 5,
                                }}
                              >
                                <Image
                                  source={{ uri: inputSIMCImage }}
                                  style={{
                                    width: 150,
                                    height: 90,
                                    borderRadius: 10,
                                  }}
                                  resizeMode="contain"
                                />
                              </View>
                              <Pressable
                                style={{
                                  marginStart: 15,
                                  flexDirection: "row",
                                  gap: 2,
                                  alignItems: "flex-end",
                                  marginBottom: 5,
                                }}
                                onPress={selectSIMCImage}
                              >
                                <Feather name="edit-3" size={15} color="gray" />
                                <Text style={{ fontSize: 12, color: "gray" }}>Edit SIM C</Text>
                              </Pressable>
                            </View>
                          )}
                        </View>
                      </View>
                    </View>
                    {/* end Sim C */}
                  </View>
                ) : (
                  <View style={[styles.itemsContainer, { paddingHorizontal: 20, paddingTop: 10 }]}>
                    {userReviews.map((e) => (
                      <CardReview review={e} key={e.id} />
                    ))}
                  </View>
                )}

                {/* end document */}
              </ScrollView>
            </View>
          </ScrollView>
        </ImageBackground>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  mastheadContainer: {
    flexDirection: "row",
    gap: 5,
    paddingHorizontal: 20,
    paddingTop: 70,
    paddingBottom: 10,
    backgroundColor: "#17799A",
    justifyContent: "flex-end",
  },
  scrollViewContainer: {
    position: "relative",
    zIndex: 0,
  },
  itemContainer: {
    backgroundColor: "white",
    height: "500%",
  },
  top: {
    backgroundColor: "#17799A",
    width: "100%",
    height: 100,
    position: "absolute",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    zIndex: 1,
  },
  profileContainer: {
    backgroundColor: "white",
    shadowColor: "black",
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 10,

    gap: 15,
    zIndex: 2,
  },
  profileButton: {
    backgroundColor: "#17799A",
    padding: 13,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },

  profileImage: {
    width: 85,
    height: 85,
    borderRadius: 10,
  },

  profileName: { fontSize: 18, marginBottom: 8, fontWeight: "600" },
  profileInfo: { fontSize: 13, color: "gray" },
  profileButtonText: { color: "white", fontWeight: "500" },

  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },

  itemsContainer: {
    paddingHorizontal: 10,
    gap: 5,
    justifyContent: "center",
  },

  itemsTitle: {
    marginStart: 3,
    fontSize: 14,
    fontWeight: "bold",
    color: "gray",
  },

  itemsBackgroundContainer: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    justifyContent: "flex-start",
  },

  itemsDetailTitle: {
    fontSize: 14,
    fontWeight: "500",
  },
  itemsDetailInfo: {
    fontSize: 11,
    color: "green",
  },

  documentContainer: {
    flexDirection: "row",
    marginTop: 10,
    marginEnd: 10,
  },
});

export default Profile;
