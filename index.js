const express = require("express");
const app = express();
const path = require("path");
const PORT = 5000;
const hbs = require("hbs");
const bcrypt = require("bcrypt");
const { where } = require("sequelize");
const config = require("./config/config.json");
const { Sequelize, QueryTypes } = require("sequelize");
const session = require("express-session");
const flash = require("express-flash");
const upload = require("./middlewares/upload-file");

const sequelize = new Sequelize(config.development);

const projectModel = require("./models").project;
const userModel = require("./models").user;

// handelbars (hbs) setup
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

// static route; to access the files in selected directories
app.use("/assets", express.static(path.join(__dirname, "assets")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// body parser permission
app.use(express.urlencoded({ extended: true }));

// configure session
app.use(
  session({
    name: "my-session",
    secret: "jasSD9j23Ljd",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

// integrate flash
app.use(flash());

// Helper to check if an array contains a value
hbs.registerHelper("contains", function (value, array) {
  return array.includes(value);
});

// PORT listener
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} bruh...`);
});

// Routing
app.get("/", home);
app.get("/add-project", addProjectView);
app.get("/edit-project/:id", editProjectView);
app.get("/contact", contact);
app.get("/testimonials", testimonials);
app.get("/login", loginView);
app.get("/register", registerView);
app.get("/logout", logoutView);
app.get("/project-detail/:id", projectDetail);
app.get("/not-found", notFound);

// Handler
app.post("/add-project", upload.single("imageUpload"), addProject);
app.get("/delete-project/:id", deleteProject);
app.post("/edit-project/:id", upload.single("imageUpload"), editProject);
app.post("/register", register);
app.post("/login", login);
app.post("/logout", logout);

// Functions

// Router functions
async function home(req, res) {
  const { user } = req.session;
  let query;

  if (user) {
    // Show only the logged-in user's projects
    query = `
      SELECT public.projects.*, public.users.name 
      FROM public.projects 
      INNER JOIN public.users 
      ON public.projects.user_id = public.users.id
      WHERE public.projects.user_id = ${user.id};`;
  } else {
    // Show all projects if no one is logged in
    query = `
    SELECT public.projects.*, public.users.name 
    FROM public.projects 
    INNER JOIN public.users ON public.projects.user_id = public.users.id;`;
  }

  const result = await sequelize.query(query, { type: QueryTypes.SELECT });
  res.render("index", { projects: result, user });
}

function addProjectView(req, res) {
  const { user } = req.session;
  if (!user) return res.redirect("/");
  res.render("add-project", { user });
}

async function editProjectView(req, res) {
  const { user } = req.session;
  const { id } = req.params;
  if (!user) return res.redirect("/");
  const result = await projectModel.findOne({
    where: {
      id: id,
    },
  });
  if (!result) return res.render("not-found");
  res.render("edit-project", { projects: result, user });
}

function contact(req, res) {
  const { user } = req.session;
  res.render("contact", { user });
}

function testimonials(req, res) {
  const { user } = req.session;
  res.render("testimonials", { user });
}

function loginView(req, res) {
  const { user } = req.session;
  res.render("login", { user });
}

function registerView(req, res) {
  const { user } = req.session;
  res.render("register", { user });
}

function logoutView(req, res) {
  const { user } = req.session;
  res.render("logout", { user });
}

async function projectDetail(req, res) {
  const { user } = req.session;
  const { id } = req.params;

  if (!user) return res.redirect("/");

  const query = `
  SELECT public.projects.*, public.users.name 
  FROM public.projects 
  INNER JOIN public.users ON public.projects.user_id = public.users.id 
  WHERE public.projects.id = :id;
  `;
  const result = await sequelize.query(query, {
    replacements: { id: id },
    type: QueryTypes.SELECT,
  });

  if (!result) return res.render("not-found");
  res.render("project-detail", { projects: result[0], user });
}

function notFound(req, res) {
  const { user } = req.session;
  res.render("not-found", { user });
}

// Handler functions
async function addProject(req, res) {
  const { user } = req.session;
  let { projectName, startDate, endDate, description, tech, user_id } =
    req.body;

  // if req.file.path is undefined (cannot access), use placeholder
  const imagePath = req.file
    ? req.file.path
    : "../assets/images/project-placeholder.jpg";

  await projectModel.create({
    title: projectName,
    start_date: startDate,
    end_date: endDate,
    duration: calculateDuration(startDate, endDate),
    description,
    technologies: toArray(tech),
    image: imagePath,
    user_id: user.id,
  });

  res.redirect("/");
}

async function deleteProject(req, res) {
  const { id } = req.params;
  let result = await projectModel.findOne({
    where: {
      id: id,
    },
  });

  if (!result) return res.render("not-found");

  await projectModel.destroy({
    where: {
      id: id,
    },
  });
  res.redirect("/");
}

async function editProject(req, res) {
  const { id } = req.params;
  let { projectName, startDate, endDate, description, tech } = req.body;
  const imagePath = req.file ? req.file.path : undefined;

  const project = await projectModel.findOne({
    where: {
      id: id,
    },
  });

  if (!project) return res.render("not-found");

  project.title = projectName;
  project.start_date = startDate;
  project.end_date = endDate;
  project.duration = calculateDuration(startDate, endDate);
  project.description = description;
  project.technologies = toArray(tech);
  // Update the image only if a new one was uploaded
  if (imagePath) {
    project.image = imagePath;
  }

  // upsert - update and insert (can also create when id is empty)
  await project.save();

  res.redirect("/");
}

async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    // set hashing parameter (higher: more complex and expensive)
    const saltRounds = 10;
    // auto-gen a salt and hash
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    req.flash("success", "Register successful");
    res.redirect("/");
  } catch (error) {
    req.flash("error", "Register failed, please try again");
    res.redirect("/register");
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    // check if email exist in db
    const user = await userModel.findOne({
      where: {
        email: email,
      },
    });
    if (!user) {
      req.flash("error", "Email or password is invalid");
      return res.redirect("/login");
    }

    // check if password matches the hash value
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      req.flash("error", "Email or password is invalid");
      return res.redirect("/login");
    }

    req.session.user = user;
    req.flash("success", "Login successful!");
    res.redirect("/");
  } catch (error) {
    req.flash("error", "Something went wrong!");
    res.redirect("/login");
  }
}

function logout(req, res) {
  try {
    // destroy the session and redirect to login
    req.session.destroy((err) => {
      if (err) {
        console.error("Failed to destroy session:", err);
        return res.redirect("/");
      }
      res.redirect("/login");
    });
  } catch (error) {
    res.redirect("/");
  }
}

// Logic functions
function calculateDuration(startDate, endDate) {
  // Calculate project duration
  const startDateInMs = new Date(startDate);
  const endDateInMs = new Date(endDate);
  let projectDurationNum = endDateInMs - startDateInMs;
  // convert ms to days
  projectDurationNum = projectDurationNum / (1000 * 60 * 60 * 24);
  let projectDuration = "";
  if (projectDurationNum / 365 >= 1) {
    const years = Math.floor(projectDurationNum / 365);
    projectDuration += years + " years ";
    projectDurationNum -= 365 * years;
  }
  if (projectDurationNum / 30 >= 1) {
    const months = Math.floor(projectDurationNum / 30);
    projectDuration += months + " months ";
    projectDurationNum -= 30 * months;
  }
  projectDuration += Math.floor(projectDurationNum) + " days";
  return projectDuration;
}

function toArray(tech) {
  // Ensure tech is always an array
  tech = Array.isArray(tech) ? tech : [tech];
  return tech;
}
