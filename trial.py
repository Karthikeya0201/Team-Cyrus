import os
from groq import Groq
import PyPDF2

GROQ_API_KEY = "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"
client = Groq(api_key=GROQ_API_KEY)

RESUME_TEMPLATES = [
    "curvecv",
    "altacv",
    "simple_hipster_cv",
    "anti_cv",
    "rendercv_classic_theme",
    "minimalistic_resume",
    "moderncv",
    "friggeri_cv",
    "twenty_seconds_cv",
    "professional_cv"
]

def extract_text_from_pdf(pdf_path):
    """Extract text from PDF file"""
    try:
        with open(pdf_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text() or ""
            print("Extracted resume text preview:", text[:200])
            return text
    except Exception as e:
        print(f"Error reading PDF: {e}")
        return None

def ensure_valid_latex(latex_content, template_name, resume_text):
    """Ensure the LaTeX content is valid and compilable, using resume text in fallback"""
    default_preamble = r"""
    \documentclass[a4paper,10pt]{article}
    \usepackage[utf8]{inputenc}
    \usepackage{geometry}
    \geometry{left=1.00in, right=1.00in, top=1.00in, bottom=1.00in}
    \usepackage{fontawesome5}
    \usepackage{hyperref}
    \usepackage{titlesec}
    \usepackage{enumitem}
    \usepackage{xcolor}
    \definecolor{accent}{RGB}{0,102,204}
    \pagestyle{empty}
    """
    default_content = r"""
    \begin{center}
    {\Huge \textbf{Kavadi Varshith Reddy}} \\
    \vspace{5pt}
    \small
    \faEnvelope~\href{mailto:varshu271105@gmail.com}{varshu271105@gmail.com} \quad
    \faPhone~+91-9392780936 \quad
    \faMapMarker~Hyderabad, India \quad
    \faLinkedin~\href{https://linkedin.com/in/kavadi-varshith-reddy}{Kavadi Varshith Reddy} \quad
    \faGithub~\href{https://github.com/Varshith271105}{Varshith271105}
    \end{center}
    \vspace{10pt}
    \section*{Objective}
    Motivated Machine Learning enthusiast with expertise in deep learning, Python, and TensorFlow, seeking to contribute to innovative solutions.
    \section*{Projects}
    \begin{itemize}
        \item \textbf{Real-time Object Detection System} \hfill 2024 \\
              Developed using YOLOv5 for efficient real-time detection.
    \end{itemize}
    """

    print("Raw Grok output preview:", latex_content[:200] if latex_content else "Empty output")
    begin_doc_idx = latex_content.find(r"\begin{document}")
    end_doc_idx = latex_content.rfind(r"\end{document}")

    if begin_doc_idx == -1 or end_doc_idx == -1:
        print("Missing \\begin{document} or \\end{document}. Reconstructing with resume data.")
        return default_preamble + r"\begin{document}" + "\n" + default_content + r"\end{document}"

    preamble_content = latex_content[:begin_doc_idx].strip()
    document_content = latex_content[begin_doc_idx + len(r"\begin{document}"):end_doc_idx].strip()

    if any(cmd in preamble_content for cmd in [r"\section", r"\item", r"\textbf"]) and not preamble_content.startswith(r"\documentclass"):
        print("Content detected before \\begin{document}. Moving it inside.")
        document_content = preamble_content + "\n" + document_content
        preamble_content = default_preamble

    begin_count = latex_content.count(r"\begin{document}")
    end_count = latex_content.count(r"\end{document}")
    if begin_count > 1 or end_count > 1:
        print("Duplicate \\begin{document} or \\end{document} detected. Using single pair.")
        latex_content = preamble_content + r"\begin{document}" + "\n" + document_content + r"\end{document}"
    else:
        latex_content = preamble_content + r"\begin{document}" + "\n" + document_content + r"\end{document}"

    for env in ["itemize", "multicols", "tcolorbox"]:
        begin_count = latex_content.count(f"\\begin{{{env}}}")
        end_count = latex_content.count(f"\\end{{{env}}}")
        if begin_count > end_count:
            print(f"Detected unclosed \\begin{{{env}}}. Adding missing \\end{{{env}}}.")
            latex_content = latex_content.rstrip() + f"\n\\end{{{env}}}" * (begin_count - end_count) + r"\end{document}"

    if not latex_content.strip().startswith(r"\documentclass"):
        print("Invalid preamble detected. Using default preamble.")
        latex_content = default_preamble + r"\begin{document}" + "\n" + document_content + r"\end{document}"

    return latex_content

def analyze_and_enhance_resume(resume_text, job_description, additional_info, template_name):
    """Generate an enhanced LaTeX resume using Grok model tailored to the job description and template"""
    system_instruction = r"""You are a Resume Enhancing AI built by xAI. Output must be valid, error-free LaTeX code that compiles to a PDF without any LaTeX errors. 
    Analyze the provided resume text and enhance it to suit the given job description, focusing on a Machine Learning role, using the '{template_name}' style as a structural and aesthetic guide. 
    - Include all factual details from the resume (Name, Contact info, Section headings, etc.).
    - Enhance the content by inferring and emphasizing related skills and experiences that can reasonably be derived from the resume, aligning them with the job description.
    - Incorporate the additional information provided by the user as new factual content (e.g., new projects, skills, or experiences), even if not present in the original resume, and enhance it similarly.
    - Do NOT add skills or experiences not implied by the resume text unless provided in the additional information; enhance existing details with professional phrasing and relevant keywords.
    - For example, if the resume or additional info mentions a GAN model project, infer and highlight skills like Data Preprocessing, Feature Engineering, Model Evaluation, EDA, TensorFlow, PyTorch, Pandas, NumPy, Jupyter Notebook, Neural Networks, and Deep Learning, but only if they can be reasonably tied to the content.
    - Use the job description to guide the enhancement, but do not copy skills directly from it unless supported by the resume or additional info.

    ### LaTeX Structure and Template Styling
    Structure the LaTeX document using \documentclass[a4paper,10pt]{article} with packages: geometry (margins: 1in all sides), fontawesome5, hyperref, titlesec, enumitem, xcolor (for color support), and \pagestyle{empty}.
    - **MANDATORY**: Start with a preamble (\documentclass and packages), followed by \begin{document} exactly once before any content, and \end{document} exactly once at the end. All content must be between these tags.

    Adapt the layout and styling according to the '{template_name}' theme:
    1. **curvecv**: Single-column; serif font (\usepackage{times}); small caps titles (\titleformat{\section}{\large\scshape}{}{0em}{}); use \Rubric for section-like structure.
    2. **altacv**: Mimic two-column layout with \parbox or minipage; personal info at top with icons; use \definecolor{accent}{RGB}{0,102,204} for headers; skills with custom star rating (e.g., \textbullet).
    3. **simple_hipster_cv**: Single-column; sans-serif font (\usepackage{helvet}, \renewcommand{\familydefault}{\sfdefault}); colorful headers (\definecolor{hipsterblue}{RGB}{0,128,255}, \titleformat{\section}{\color{hipsterblue}\large\bfseries}{}{0em}{}).
    4. **anti_cv**: Minimalist single-column; no icons; plain text focus (\titleformat{\section}{\large\bfseries}{}{0em}{}); tight spacing (\vspace{0.1em}).
    5. **rendercv_classic_theme**: Single-column; clean layout with subtle lines (\titleformat{\section}{\large\bfseries}{}{0em}{#1\\\hrule height 0.5pt}); serif font (\usepackage{times}).
    6. **minimalistic_resume**: Single-column; ultra-minimalist with no extra formatting (\titleformat{\section}{\large\bfseries}{}{0em}{}); no colors or icons.
    7. **moderncv**: Single-column; modern layout with icons (\faIcon{icon-name}); blue titles (\definecolor{modernblue}{RGB}{0,51,153}, \titleformat{\section}{\color{modernblue}\large\bfseries}{}{0em}{}).
    8. **friggeri_cv**: Two-column (\usepackage{multicol}, \begin{multicols}{2} ... \end{multicols}); stylish headers (\definecolor{friggerigray}{RGB}{80,80,80}, \titleformat{\section}{\color{friggerigray}\large\bfseries}{}{0em}{}).
    9. **twenty_seconds_cv**: Single-column; bold timeline on left (\titleformat{\section}{\large\bfseries}{}{0em}{}); sans-serif (\usepackage{helvet}).
    10. **professional_cv**: Single-column; formal layout with underlines (\titleformat{\section}{\large\bfseries}{}{0em}{#1\\\hrule height 0.5pt}); serif font (\usepackage{times}).

    ### Error-Free LaTeX Requirements
    - The output MUST compile to a PDF without errors using only standard packages. Include a valid preamble, \begin{document}, content, and \end{document}.
    - Include all required packages in the preamble.
    - Close all environments (e.g., \begin{itemize} ... \end{itemize}).
    - Use correct syntax for all commands and avoid undefined commands.
    """.replace("{", "{{").replace("}", "}}").format(template_name=template_name)

    prompt = f"Resume text:\n{resume_text}\n\nJob description:\n{job_description}\n\nAdditional information provided by user:\n{additional_info}\nTemplate name:\n{template_name}"

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": system_instruction},
                {"role": "user", "content": prompt}
            ],
            temperature=1.0,
            max_tokens=32768,
            top_p=0.95
        )
        latex_content = response.choices[0].message.content
        return ensure_valid_latex(latex_content, template_name, resume_text)
    except Exception as e:
        print(f"Error generating enhanced resume with Groq: {e}")
        return ensure_valid_latex("", template_name, resume_text)

def save_updated_resume(updated_content, template_name):
    """Save the updated resume to the output folder"""
    output_dir = "output"
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    output_filename = f"resume_updated_{template_name}.tex"
    output_path = os.path.join(output_dir, output_filename)
    with open(output_path, 'w', encoding='utf-8') as file:
        file.write(updated_content)
    print(f"Updated resume saved as {output_path}")

def main():
    DEFAULT_RESUME_PATH = r"C:\Users\varsh\Desktop\CRACK\Varshith_Reddy_Resume.pdf"
    while True:
        try:
            template_num = int(input("Enter template number (1-10): "))
            if 1 <= template_num <= 10:
                break
            print("Please enter a template number between 1 and 10")
        except ValueError:
            print("Please enter a valid number")
    template_name = RESUME_TEMPLATES[template_num - 1]
    print(f"Selected template: {template_name}")
    job_description = input("Enter the job description: ")
    if not job_description.strip():
        print("Job description cannot be empty!")
        return
    additional_info = input("Enter any additional information (skills, projects, experiences) not in your resume (or press Enter to skip): ")
    if not additional_info.strip():
        additional_info = "No additional information provided."
    if not os.path.exists(DEFAULT_RESUME_PATH):
        print(f"Default resume file not found at {DEFAULT_RESUME_PATH}!")
        return
    resume_text = extract_text_from_pdf(DEFAULT_RESUME_PATH)
    if not resume_text:
        return
    latex_resume = analyze_and_enhance_resume(resume_text, job_description, additional_info, template_name)
    if not latex_resume:
        return
    try:
        save_updated_resume(latex_resume, template_name)
    except Exception as e:
        print(f"Error saving template {template_name}: {e}")

if __name__ == "__main__":
    if not os.path.exists("templates"):
        os.makedirs("templates")
        print("Created templates folder. Please add template files (1.tex to 10.tex) if you want to use them.")
    try:
        from groq import Groq
        import PyPDF2
    except ImportError:
        print("Please install required packages: pip install groq PyPDF2")
        exit(1)
    main()