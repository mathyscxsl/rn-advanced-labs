import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type NameProps = {
  name: string;
};

const Name = ({ name }: NameProps) => {
  return <Text style={styles.name}>{name}</Text>;
};

const ProfileCard = () => {
  const [followers, setFollowers] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    setFollowers((prev) => prev + (isFollowing ? -1 : 1));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setFollowers((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image
          source={{
            uri: "https://media.tenor.com/GbgrBF2JzLcAAAAe/tk78-thekairi78.png",
          }}
          style={styles.avatar}
        />
        <Name name="John Doe" />
        <Text style={styles.followers}>{followers} Followers</Text>

        <TouchableOpacity
          style={[styles.button, isFollowing && styles.buttonFollowing]}
          onPress={handleFollow}
        >
          <Text style={styles.buttonText}>
            {isFollowing ? "Following" : "Follow"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 12,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  followers: {
    fontSize: 16,
    color: "#666",
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#1DA1F2",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  buttonFollowing: {
    backgroundColor: "#888",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default ProfileCard;
