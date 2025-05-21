'use strict'

const Database = use('Database')
const Env = use('Env')
const Helpers = use('Helpers')
const Startup = use('App/Models/Startup')
const Founder = use('App/Models/Founder')

const BASE_URL = Env.get('BASE_URL', 'http://127.0.0.1:3333')
const isDev = Env.get('NODE_ENV') === 'development'

function convertFilePathToUrl(filePath) {
  if (!filePath) return null
  const filename = filePath.split('/').pop()
  return `${BASE_URL}/uploads/${filename}`
}

class StartupController {
  async create({ request, response, auth }) {
    try {
      const user_id = auth.user.id
      console.log('Authenticated user ID:', user_id)

      const {
        startup_name,
        startup_description,
        startup_location,
        startup_website,
        startup_email,
        team_size,
        no_of_teams,
        cofounder,
        linkedin_profile,
        nin,
        amount_of_funds,
        usage_of_funds,
        no_of_customers,
        video,
        startup_industry,
        full_name,
        founder_linkedin_profile,
        email_address,
        phone_no,
        founder_nin,
        role,
      } = request.post()

      const startupPictureFile = request.file('startup_picture')
      const profileImageFile = request.file('profile_image')

      let startupPicturePath = null
      let profileImagePath = null

      if (startupPictureFile) {
        await startupPictureFile.move(Helpers.publicPath('uploads'), {
          name: startupPictureFile.clientName,
          overwrite: true,
        })
        if (!startupPictureFile.moved()) {
          return response.status(400).send(startupPictureFile.error())
        }
        startupPicturePath = `uploads/${startupPictureFile.clientName}`
      }

      if (profileImageFile) {
        await profileImageFile.move(Helpers.publicPath('uploads'), {
          name: profileImageFile.clientName,
          overwrite: true,
        })
        if (!profileImageFile.moved()) {
          return response.status(400).send(profileImageFile.error())
        }
        profileImagePath = `uploads/${profileImageFile.clientName}`
      }

      // Check for duplicates
      const existingFounder = await Founder.query()
        .where('email_address', email_address)
        .first()

      if (existingFounder) {
        return response.status(400).json({ message: 'Founder email address already exists.' })
      }

      const existingStartup = await Startup.query()
        .where('startup_email', startup_email)
        .first()

      if (existingStartup) {
        return response.status(400).json({ message: 'Startup email address already exists.' })
      }

      // ✅ Create founder with model
      const founder = new Founder()
      founder.merge({
        full_name,
        linkedin_profile: founder_linkedin_profile,
        email_address,
        phone_no,
        profile_img: profileImagePath,
        nin: founder_nin,
        role,
        user_id,
      })
      await founder.save()

      // ✅ Create startup with model
      const startup = new Startup()
      startup.merge({
        startup_name,
        startup_description,
        startup_location,
        startup_website,
        startup_email,
        startup_picture: startupPicturePath,
        team_size: parseInt(team_size),
        no_of_teams: parseInt(no_of_teams),
        cofounder,
        profile_image: profileImagePath,
        linkedin_profile,
        nin,
        amount_of_funds: parseInt(amount_of_funds),
        usage_of_funds,
        no_of_customers: parseInt(no_of_customers),
        video,
        startup_industry,
        founder_id: founder.id,
        user_id,
      })
      await startup.save()

      return response.status(201).json({
        message: 'Startup and founder created successfully',
        data: {
          startup,
          founder,
        }
      })

    } catch (error) {
      console.error('StartupController.create Error:', error)
      return response.status(500).json({
        message: 'Internal server error',
        error: error.message,
      })
    }
  }


  async getAll({ response }) {
    try {
      const startups = await Database
        .select(
          's.*',
          'f.full_name as founder_full_name',
          'f.linkedin_profile as founder_linkedin_profile',
          'f.email_address as founder_email',
          'f.phone_no as founder_phone_no',
          'f.profile_img as founder_profile_img',
          'f.nin as founder_nin',
          'f.role as founder_role',
        )
        .from('startups as s')
        .leftJoin('founders as f', 's.founder_id', 'f.id') // fixed here

      if (startups.length === 0) {
        return response.status(404).json({ message: 'No startups found' })
      }

      const formattedData = startups.map((row) => ({
        ...row,
        startup_picture: convertFilePathToUrl(row.startup_picture),
        profile_image: convertFilePathToUrl(row.profile_image),
        founder_profile_img: convertFilePathToUrl(row.founder_profile_img),
      }))

      return response.status(200).json({
        message: 'Startups and founders retrieved successfully',
        data: formattedData,
      })
    } catch (error) {
      console.error('StartupController.getAll Error:', {
        message: error.message,
        stack: error.stack,
        code: error.code,
        detail: error.detail,
      })
      return response.status(500).json({
        message: 'Internal server error',
        ...(isDev && { error: error.message }),
      })
    }
  }

  async getById({ params, response }) {
    const { id } = params
    try {
      const row = await Database
        .select(
          's.*',
          'f.full_name as founder_full_name',
          'f.linkedin_profile as founder_linkedin_profile',
          'f.email_address as founder_email',
          'f.phone_no as founder_phone_no',
          'f.profile_img as founder_profile_img',
          'f.nin as founder_nin',
          'f.role as founder_role',
        )
        .from('startups as s')
        .leftJoin('founders as f', 's.founder_id', 'f.id') // fixed here
        .where('s.id', id) // fixed here
        .first()

      if (!row) {
        return response.status(404).json({ message: 'Startup not found' })
      }

      row.startup_picture = convertFilePathToUrl(row.startup_picture)
      row.profile_image = convertFilePathToUrl(row.profile_image)
      row.founder_profile_img = convertFilePathToUrl(row.founder_profile_img)

      return response.status(200).json({
        message: 'Startup retrieved successfully',
        data: row,
      })
    } catch (error) {
      console.error('StartupController.getById Error:', {
        message: error.message,
        stack: error.stack,
        code: error.code,
        detail: error.detail,
      })
      return response.status(500).json({
        message: 'Internal server error',
        ...(isDev && { error: error.message }),
      })
    }
  }

 async getByUserId({ auth, response }) {
  try {
    const user = await auth.getUser();
    const userId = user.id;
    console.log('Authenticated user ID:', userId);

    const startups = await Database
      .select(
        's.*',
        'f.full_name as founder_full_name',
        'f.linkedin_profile as founder_linkedin_profile',
        'f.email_address as founder_email',
        'f.phone_no as founder_phone_no',
        'f.profile_img as founder_profile_img',
        'f.nin as founder_nin',
        'f.role as founder_role',
      )
      .from('startups as s')
      .leftJoin('founders as f', 's.founder_id', 'f.id')
      .where('s.user_id', userId)
      .debug(true);

    if (startups.length === 0) {
      return response.status(404).json({ message: `No startup found for user with id ${userId}` });
    }

    const formattedData = startups.map((row) => ({
      ...row,
      startup_picture: convertFilePathToUrl(row.startup_picture),
      profile_image: convertFilePathToUrl(row.profile_image),
      founder_profile_img: convertFilePathToUrl(row.founder_profile_img),
    }));

    console.log('Formatted startups data:', formattedData);

    return response.status(200).json({
      message: 'Startups retrieved successfully',
      data: formattedData,
    });
  } catch (error) {
    console.error('StartupController.getByUserId Error:', error);
    return response.status(500).json({
      message: 'Internal server error',
      error: error.message,
    });
  }
}



}

module.exports = StartupController
