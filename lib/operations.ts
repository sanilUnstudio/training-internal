import prisma from "./prisma";

//Make an interface for createUser
interface createUserProps {
  email: string;
  name: string;
  image: string;
}

// 0	Free
// 1	Hobby
// 2	Hobby
// 3	Pro
// 4	Pro
// 5	Enterprise
// 6	Enterprise
// 7	Dev

export const createUser = async (props: createUserProps) => {
  try {
    const { email, name, image } = props;

    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      console.log("User already exists");
      //Update user's planID, credit , id and other details if needed
      const generatedID = Math.random().toString(36).substring(7);
      const id = `unstudio-${generatedID}`;
      const isUnstudio = email.includes("unstudio.ai");
      const planID = isUnstudio ? (7).toString() : (0).toString();
      const credit = isUnstudio ? 150000 : 15;
      const apiCredit = isUnstudio ? 250 : 10;
      const user = await prisma.user.update({
        where: {
          email: email,
        },
        data: {
          id,
          email,
          name,
          image,
          planID,
          credit,
          apiCredit,
        },
      });

      return user;
    }

    const generatedID = Math.random().toString(36).substring(7);
    const id = `unstudio-${generatedID}`;
    const isUnstudio = email.includes("unstudio.ai");
    const planID = isUnstudio ? (7).toString() : (0).toString();
    const credit = isUnstudio ? 150000 : 15;
    const apiCredit = isUnstudio ? 250 : 10;
    const user = await prisma.user.create({
      data: {
        id,
        email,
        name,
        image,
        planID,
        credit,
        apiCredit,
      },
    });
    return user;
  } catch (error) {
    console.log("Error creating user", error);
    return null;
  }
};

export const getUserInfo = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    return user;
  } catch (error) {
    console.log("Error getting user info", error);
    return null;
  }
};
