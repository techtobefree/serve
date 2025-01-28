export enum IMAGE_SIZE {
  AVATAR_SMALL = "avatar_small",
  AVATAR_MEDIUM = "avatar_medium",
  AVATAR_LARGE = "avatar_large",
  QR = "QR",
  PROJECT_SMALL = "project_small",
  PROJECT_MEDIUM = "project_medium",
  PROJECT_LARGE = "project_large",
}

export const IMAGE_SIZE_MAP = {
  [IMAGE_SIZE.AVATAR_SMALL]: "w-[50px] h-[50px]",
  [IMAGE_SIZE.AVATAR_MEDIUM]: "w-[100px] h-[100px]",
  [IMAGE_SIZE.AVATAR_LARGE]: "w-[200px] h-[200px]",
  [IMAGE_SIZE.QR]: "w-[200px] h-[200px]",
  [IMAGE_SIZE.PROJECT_SMALL]: "w-[128px] h-[128px]",
  [IMAGE_SIZE.PROJECT_MEDIUM]: "w-[300px] h-[200px]",
  [IMAGE_SIZE.PROJECT_LARGE]: "w-[400px] h-[300px]",
};
