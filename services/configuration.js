
const {Configurations} = require('../models');

const CONFIGURATION_KIND = {
	RESUME_TICKET: 1,
}

const RESUME_TYPE ={
	PRICE: 1,
	DESCRIPTION: 2,
}

const DEFAULT_RESUME_PRICE = 99;

async function getConfigurations(kind)
{
	var result = {};
	try{
        const confs = await Configurations.findAll({
			where:{
				kind
			}
		});

		
		
		confs.map((item)=>{
			//console.log("conf",item.dataValues);
			result[item.dataValues.type] = item.dataValues.value;
		});
    }catch (e) {
		console.log("getConfigurations",e);
	}
	console.log(result);
	return result;
}

async function getSingleConfigration(kind,type)
{
	var result = null;
	try{
		const configration = await Configurations.findOne({
			where:{
				kind,
				type
			}
		});
		if(configration)
			result = configration.value;
	}catch(e)
	{
		console.log("getSingleConfigration",e);
	}
	return result;
}

async function setConfiguration(kind,type,value)
{
	try{
		const exist = await getSingleConfigration(kind,type);
		console.log("exist",exist)
		if(exist)
		{
			await Configurations.update({value},{
				where:{
					kind,
					type
				}
			});
		}
		else
		{
			await Configurations.create({
				kind,
				type,
				value
			});
		}
	}
	catch(e)
	{

	}
}

async function getResumeConfiguration()
{
	const result = {
		price: DEFAULT_RESUME_PRICE,
		description: ''
	}

	try{
		const resumeConf = await getConfigurations(CONFIGURATION_KIND.RESUME_TICKET);

		var tempConf;

		tempConf = resumeConf[RESUME_TYPE.PRICE];
		result.price = tempConf ? tempConf : result.price;

		tempConf = resumeConf[RESUME_TYPE.DESCRIPTION];
		result.description = tempConf ? tempConf :result.description;
	}catch(e)
	{
		console.log("getResumeConfiguration",e);
	}

	return result;
}

async function setResumeConfigration(resumeConf)
{
	try{
		await setConfiguration(CONFIGURATION_KIND.RESUME_TICKET,RESUME_TYPE.PRICE,resumeConf.price);
		await setConfiguration(CONFIGURATION_KIND.RESUME_TICKET,RESUME_TYPE.DESCRIPTION,resumeConf.description);
	}catch(e)
	{
		console.log("setResumeConfigration",e);
	}
}

module.exports = {
	getConfigurations,
	getSingleConfigration,
	setConfiguration,
	getResumeConfiguration,
	setResumeConfigration
}