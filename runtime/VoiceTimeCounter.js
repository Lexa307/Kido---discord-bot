const pool = require('../DB/db');
const voice = { };
const VoiceTateUpdate = (old, member) => {
	if(member.voiceChannelID === null || member.selfMute === true) { //null - leaved from voice; selfMute - muted himself
		clearInterval(voice[member.user.id]); // stop recording voice;
		return; // stop alg;
	} else {
		if(member.selfMute === true) return; //ignore if muted himself;
		if(old.voiceChannelID === member.voiceChannelID) return; //ignore this channel updates - anti layering voice recording;
		voice[member.user.id] = setInterval( () => {
			pool.query(`SELECT voicem,voiceh,gifts FROM users WHERE id = '${member.user.id}' LIMIT 1`, (err, rows) => {
				if(!rows[0]) return; //ignore in not exits;
				//record 1 voice minute;
				pool.query(`UPDATE users SET voicem = ${rows[0].voicem + 1} WHERE id = '${member.user.id}' LIMIT 1`);
				if(rows[0].voicem >= 60) {
				//record 1 voice hour, set voice minutes to 00;
					 pool.query(`UPDATE users SET voiceh = ${rows[0].voiceh + 1}, voicem = 0 WHERE id = '${member.user.id}' LIMIT 1`);
					 if(rows[0].voiceh == 11) {
                                	//Every 12 hours member will get 1 gift;
                                	//Gift can drop a private role for 3/5/7 days | premium role for 7 days | 100-200 server currency;
                               	         	pool.query(`UPDATE users SET gifts = ${rows[0].gifts + 1} WHERE id = '${member.user.id}' LIMIT 1`);
						member.user.send("Вы получили 1 🎁 за то что просидели в войсе более 12 часов!");
                                	}
				}
			})
		}, 60000)
	}
}
module.exports = VoiceTateUpdate;