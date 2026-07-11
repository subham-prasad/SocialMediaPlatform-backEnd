import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  //Take the user input
  const { userName, email, fullName, password } = req.body;
  console.log("email: ", email);

  //Validation check if it is empty
  if (
    [fullName, email, userName, password].some((field) => field?.trim === "")
  ) {
    throw new ApiError("400", "All fileds are compulsary and required");
  }

  //   {/* //Check if username or email already exists or not */}
  const existedUser = User.findOne({
    $or: [{ userName }, { email }],
  });

  if (existedUser) {
    throw new ApiError("409", "User with email or Username already exists");
  }

  const avatarLocalPath = req.files?.avatar[0].path;
  const coverImageLocalPath = req.files?.coverImage[0].path;

  //Check if Avartar is present or now
  if (!avatarLocalPath) {
    throw new ApiError("400", "Avatar file is required");
  }
  //Upload it in the cloud

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError("400", "Avatar file is required");
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    userName: userName.tolower(),
  });

  const createdUser = User.findById(user._id).select("-password -refreshToken");

  if(!createdUser){
    throw new ApiError("500", "Something went wrong while registring the user");

  }

  return res.status(201).json(
    new ApiResponse(200, createdUser,"User Registered Successfully")
  )

});

export { registerUser };
