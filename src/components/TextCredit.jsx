
import { contractSections } from "./TextObject";
const TextCredit = () => {
    return (
        <div>
            {contractSections.map((section, index) => (
                <div key={index}>
                    <p><b>{section.title}</b></p>
                    <ul>
                        {section.items.map((item, itemIndex) => (
                            <li key={itemIndex}>{item}</li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default TextCredit;