const axios = require('axios')

module.exports.generateSummary = async (req,res) => {
    const {content} = req.body;
    if(!content){
        return res.status(400).json({error: 'Content is required'});
    }

    try {
        const response = await axios.post(
            'https://api-inference.huggingface.co/models/facebook/bart-large-cnn',
            { inputs: content },
            {
                headers: {
                    Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                    "Content-Type": "application/json",
                }
            }
        )

        const summary = response.data[0]?.summary_text;
        if (!summary) {
            return res.status(500).json({ error: 'Failed to generate summary' });
        }

        res.status(200).json({ summary });
    } catch (error) {
        console.error('Error generating summary:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}