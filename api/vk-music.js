export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    const VK_TOKEN = process.env.VK_ACCESS_TOKEN;
    const VK_USER_ID = process.env.VK_USER_ID;
    const VK_API_VERSION = '5.131';
    
    if (!VK_TOKEN || !VK_USER_ID) {
        return res.status(500).json({ 
            error: 'Server configuration error',
            track: null 
        });
    }
    
    try {
        const vkUrl = `https://api.vk.com/method/users.get?user_ids=${VK_USER_ID}&fields=status,status_audio&access_token=${VK_TOKEN}&v=${VK_API_VERSION}`;
        
        const response = await fetch(vkUrl);
        const data = await response.json();
        
        if (data.error) {
            return res.status(400).json({ 
                error: data.error.error_msg,
                track: null 
            });
        }
        
        if (data.response && data.response.length > 0) {
            const user = data.response[0];
            
            if (user.status_audio) {
                return res.status(200).json({
                    track: {
                        artist: user.status_audio.artist || 'Неизвестный исполнитель',
                        title: user.status_audio.title || 'Без названия'
                    }
                });
            }
            
            return res.status(200).json({ track: null });
        }
        
        return res.status(404).json({ 
            error: 'User not found',
            track: null 
        });
        
    } catch (error) {
        return res.status(500).json({ 
            error: error.message,
            track: null 
        });
    }
}
