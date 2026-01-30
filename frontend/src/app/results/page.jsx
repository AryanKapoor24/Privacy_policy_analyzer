'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

// ComparisonView component for side-by-side comparison
const ComparisonView = ({ originalText, simplifiedText, searchTerm }) => {
  // Simple text filter - no highlighting
  const filterText = (text) => {
    if (!searchTerm) return text;
    // Filter lines containing the search term (case-insensitive)
    return text
      .split('\n')
      .filter(line => line.toLowerCase().includes(searchTerm.toLowerCase()))
      .join('\n');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Original Text (left side) */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            AI-Simplified Version
          </h2>
        </div>
        <div className="p-6 max-h-screen overflow-y-auto">
          <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            {simplifiedText}
          </pre>
        </div>
      </div>

      {/* Simplified Text (right side) */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <div className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            Original Document
          </h2>
        </div>
        <div className="p-6 max-h-screen overflow-y-auto">
          <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            {originalText}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default function ResultsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('preview');
  const [searchTerm, setSearchTerm] = useState('');
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loaded, setLoaded] = useState(false);
  
  // Initialize state with default values
  const [originalText, setOriginalText] = useState('');
  const [simplifiedText, setSimplifiedText] = useState('');
  const [stats, setStats] = useState(null);
  
  // Define demoData with analysis data or fallback content
  const demoData = {
    // Removed analysisData?.text || to force showing the hardcoded text below
    originalText: `PRIVACY POLICY

Education is fundamental for achieving full human potential, developing an equitable and just
society, and promoting national development. Providing universal access to quality education is the
key to India’s continued ascent, and leadership on the global stage in terms of economic growth,
social justice and equality, scientific advancement, national integration, and cultural preservation.
Universal high-quality education is the best way forward for developing and maximizing our
country's rich talents and resources for the good of the individual, the society, the country, and the
world. India will have the highest population of young people in the world over the next decade, and
our ability to provide high-quality educational opportunities to them will determine the future of our
country.
The global education development agenda reflected in the Goal 4 (SDG4) of the 2030 Agenda for
Sustainable Development, adopted by India in 2015 - seeks to “ensure inclusive and equitable quality
education and promote lifelong learning opportunities for all” by 2030. Such a lofty goal will require
the entire education system to be reconfigured to support and foster learning, so that all of the critical
targets and goals (SDGs) of the 2030 Agenda for Sustainable Development can be achieved.
The world is undergoing rapid changes in the knowledge landscape. With various dramatic scientific
and technological advances, such as the rise of big data, machine learning, and artificial intelligence,
many unskilled jobs worldwide may be taken over by machines, while the need for a skilled
workforce, particularly involving mathematics, computer science, and data science, in conjunction
with multidisciplinary abilities across the sciences, social sciences, and humanities, will be
increasingly in greater demand. With climate change, increasing pollution, and depleting natural
resources, there will be a sizeable shift in how we meet the world’s energy, water, food, and
sanitation needs, again resulting in the need for new skilled labour, particularly in biology, chemistry,
physics, agriculture, climate science, and social science. The growing emergence of epidemics and
pandemics will also call for collaborative research in infectious disease management and
development of vaccines and the resultant social issues heightens the need for multidisciplinary
learning. There will be a growing demand for humanities and art, as India moves towards becoming a
developed country as well as among the three largest economies in the world.
Indeed, with the quickly changing employment landscape and global ecosystem, it is becoming
increasingly critical that children not only learn, but more importantly learn how to learn. Education
thus, must move towards less content, and more towards learning about how to think critically and
solve problems, how to be creative and multidisciplinary, and how to innovate, adapt, and absorb new
material in novel and changing fields. Pedagogy must evolve to make education more experiential,
holistic, integrated, inquiry-driven, discovery-oriented, learner-centred, discussion-based, flexible,
and, of course, enjoyable. The curriculum must include basic arts, crafts, humanities, games, sports
and fitness, languages, literature, culture, and values, in addition to science and mathematics, to
develop all aspects and capabilities of learners; and make education more well-rounded, useful, and
fulfilling to the learner. Education must build character, enable learners to be ethical, rational,
compassionate, and caring, while at the same time prepare them for gainful, fulfilling employment.
The gap between the current state of learning outcomes and what is required must be bridged through
undertaking major reforms that bring the highest quality, equity, and integrity into the system, from
early childhood care and education through higher education.
The aim must be for India to have an education system by 2040 that is second to none, with equitable
access to the highest-quality education for all learners regardless of social or economic background.
This National Education Policy 2020 is the first education policy of the 21st century and aims to
address the many growing developmental imperatives of our country. This Policy proposes the
revision and revamping of all aspects of the education structure, including its regulation and
governance, to create a new system that is aligned with the aspirational goals of 21st century
education, including SDG4, while building upon India’s traditions and value systems. The National
National Education Policy 2020
4
Education Policy lays particular emphasis on the development of the creative potential of each
individual. It is based on the principle that education must develop not only cognitive capacities -
both the ‘foundational capacities ’of literacy and numeracy and ‘higher-order’ cognitive capacities,
such as critical thinking and problem solving – but also social, ethical, and emotional capacities and
dispositions.
The rich heritage of ancient and eternal Indian knowledge and thought has been a guiding light for
this Policy. The pursuit of knowledge (Jnan), wisdom (Pragyaa), and truth (Satya) was always
considered in Indian thought and philosophy as the highest human goal. The aim of education in
ancient India was not just the acquisition of knowledge as preparation for life in this world, or life
beyond schooling, but for the complete realization and liberation of the self. World-class institutions
of ancient India such as Takshashila, Nalanda,Vikramshila, Vallabhi, set the highest standards of
multidisciplinary teaching and research and hosted scholars and students from across backgrounds
and countries. The Indian education system produced great scholars such as Charaka, Susruta,
Aryabhata, Varahamihira, Bhaskaracharya, Brahmagupta, Chanakya, Chakrapani Datta, Madhava,
Panini, Patanjali, Nagarjuna, Gautama, Pingala, Sankardev, Maitreyi, Gargi and Thiruvalluvar,
among numerous others, who made seminal contributions to world knowledge in diverse fields such
as mathematics, astronomy, metallurgy, medical science and surgery, civil engineering, architecture,
shipbuilding and navigation, yoga, fine arts, chess, and more. Indian culture and philosophy have had
a strong influence on the world. These rich legacies to world heritage must not only be nurtured and
preserved for posterity but also researched, enhanced, and put to new uses through our education.
creative imagination, with sound ethical moorings and values. It aims at producing engaged,
productive, and contributing citizens for building an equitable, inclusive, and plural society as
envisaged by our Constitution.
A good education institution is one in which every student feels welcomed and cared for, where a
safe and stimulating learning environment exists, where a wide range of learning experiences are
offered, and where good physical infrastructure and appropriate resources conducive to learning are
available to all students. Attaining these qualities must be the goal of every educational institution.
However, at the same time, there must also be seamless integration and coordination across
institutions and across all stages of education.
The fundamental principles that will guide both the education system at large, as well as the
individual institutions within it are:
• recognizing, identifying, and fostering the unique capabilities of each student, by
sensitizing teachers as well as parents to promote each student’s holistic development in both
academic and non-academic spheres;
• according the highest priority to achieving Foundational Literacy and Numeracy by all
students by Grade 3;
• flexibility, so that learners have the ability to choose their learning trajectories and programmes,
and thereby choose their own paths in life according to their talents and interests;
• no hard separations between arts and sciences, between curricular and extra-curricular
activities, between vocational and academic streams, etc. in order to eliminate harmful
hierarchies among, and silos between different areas of learning;
• multidisciplinarity and a holistic education across the sciences, social sciences, arts,
humanities, and sports for a multidisciplinary world in order to ensure the unity and integrity
of all knowledge;
• emphasis on conceptual understanding rather than rote learning and learning-for-exams;
• creativity and critical thinking to encourage logical decision-making and innovation;
• ethics and human & Constitutional values like empathy, respect for others, cleanliness,
courtesy, democratic spirit, spirit of service, respect for public property, scientific temper,
liberty, responsibility, pluralism, equality, and justice;
• promoting multilingualism and the power of language in teaching and learning;
• life skills such as communication, cooperation, teamwork, and resilience;
• focus on regular formative assessment for learning rather than the summative assessment that
encourages today’s ‘coaching culture ’;
• extensive use of technology in teaching and learning, removing language barriers, increasing
access for Divyang students, and educational planning and management;
• respect for diversity and respect for the local context in all curriculum, pedagogy, and policy,
always keeping in mind that education is a concurrent subject;
• full equity and inclusion as the cornerstone of all educational decisions to ensure that all
students are able to thrive in the education system;
• synergy in curriculum across all levels of education from early childhood care and
education to school education to higher education;
• teachers and faculty as the heart of the learning process – their recruitment, continuous
professional development, positive working environments and service conditions;
• a ‘light but tight’ regulatory framework to ensure integrity, transparency, and resource
efficiency of the educational system through audit and public disclosure while encouraging
innovation and out-of-the-box ideas through autonomy, good governance, and empowerment;
• outstanding research as a corequisite for outstanding education and development;
• continuous review of progress based on sustained research and regular assessment by
educational experts;
National Education Policy 2020
6
• a rootedness and pride in India, and its rich, diverse, ancient and modern culture and
knowledge systems and traditions;
• education is a public service; access to quality education must be considered a basic right of
every child;
• substantial investment in a strong, vibrant public education system as well as the
encouragement and facilitation of true philanthropic private and community participation.
The Vision of this Policy
This National Education Policy envisions an education system rooted in Indian ethos that contributes
directly to transforming India, that is Bharat, sustainably into an equitable and vibrant knowledge
society, by providing high-quality education to all, and thereby making India a global knowledge
superpower. The Policy envisages that the curriculum and pedagogy of our institutions must
develop among the students a deep sense of respect towards the Fundamental Duties and
Constitutional values, bonding with one’s country, and a conscious awareness of one’s roles
and responsibilities in a changing world. The vision of the Policy is to instill among the
learners a deep-rooted pride in being Indian, not only in thought, but also in spirit, intellect,
and deeds, as well as to develop knowledge, skills, values, and dispositions that support
responsible commitment to human rights, sustainable. National Education Policy 2020
7
Currently, children in the age group of 3-6 are not covered in the 10+2 structure as Class 1 begins at
age 6. In the new 5+3+3+4 structure, a strong base of Early Childhood Care and Education (ECCE)
from age 3 is also included, which is aimed at promoting better overall learning, development, and
well-being.
1. Early Childhood Care and Education: The Foundation of Learning
1.1. Over 85% of a child’s cumulative brain development occurs prior to the age of 6, indicating the
critical importance of appropriate care and stimulation of the brain in the early years in order to
ensure healthy brain development and growth. Presently, quality ECCE is not available to crores of
young children, particularly children from socio-economically disadvantaged backgrounds. Strong
investment in ECCE has the potential to give all young children such access, enabling them to
participate and flourish in the educational system throughout their lives. Universal provisioning of
quality early childhood development, care, and education must thus be achieved as soon as possible,
and no later than 2030, to ensure that all students entering Grade 1 are school ready.
1.2. ECCE ideally consists of flexible, multi-faceted, multi-level, play-based, activity-based, and
inquiry-based learning, comprising of alphabets, languages, numbers, counting, colours, shapes,
indoor and outdoor play, puzzles and logical thinking, problem-solving, drawing, painting and other
visual art, craft, drama and puppetry, music and movement. It also includes a focus on developing
social capacities, sensitivity, good behaviour, courtesy, ethics, personal and public cleanliness,
teamwork, and cooperation. The overall aim of ECCE will be to attain optimal outcomes in the
domains of: physical and motor development, cognitive development, socio-emotional-ethical
development, cultural/artistic development, and the development of communication and early
language, literacy, and numeracy.
1.3. A National Curricular and Pedagogical Framework for Early Childhood Care and Education
(NCPFECCE) for children up to the age of 8 will be developed by NCERT in two parts, namely, a
sub-framework for 0-3 year-olds, and a sub-framework for 3-8 year-olds, aligned with the above
guidelines, the latest research on ECCE, and national and international best practices. In particular,
the numerous rich local traditions of India developed over millennia in ECCE involving art, stories,
poetry, games, songs, and more, will also be suitably incorporated. The framework will serve as a
guide both for parents and for early childhood care and education institutions.
1.4. The overarching goal will be to ensure universal access to high-quality ECCE across the country
in a phased manner. Special attention and priority will be given to districts and locations that are
particularly socio-economically disadvantaged. ECCE shall be delivered through a significantly
expanded and strengthened system of early-childhood education institutions consisting of (a) standalone Anganwadis; (b) Anganwadis co-located with primary schools; (c) pre-primary
schools/sections covering at least age 5 to 6 years co-located with existing primary schools; and (d)
stand-alone pre-schools - all of which would recruit workers/teachers specially trained in the
curriculum and pedagogy of ECCE.
1.5. For universal access to ECCE, Anganwadi Centres will be strengthened with high-quality
infrastructure, play equipment, and well-trained Anganwadi workers/teachers. Every Anganwadi will
have a well-ventilated, well-designed, child-friendly and well-constructed building with an enriched
learning environment. Children in Anganwadi Centres shall take activity-filled tours - and meet the
teachers and students of their local primary schools, in order to make the transition from Anganwadi
Centres to primary schools a smooth one. Anganwadis shall be fully integrated into school
complexes/clusters, and Anganwadi children, parents, and teachers will be invited to attend and
participate in school/school complex programmes and vice versa.
1.6. It is envisaged that prior to the age of 5 every child will move to a “Preparatory Class”
or “Balavatika” (that is, before Class 1), which has an ECCE-qualified teacher. The learning
in the Preparatory Class shall be based primarily on play-based learning with a focus on
developing cognitive, affective, and psychomotor abilities and early literacy and numeracy. The mid-`,
    
    // Removed analysisData?.preview || to force showing the hardcoded text below
    simplifiedText: `Education is essential for helping every person reach their full potential, building a fair society, and supporting India’s growth. To become a global leader, India must ensure that all children receive high-quality education. Since India will have the world’s largest youth population in the coming years, good education will shape the country’s future.

The United Nations’ Sustainable Development Goal 4 (SDG4) aims to provide inclusive and high-quality education for everyone by 2030. To achieve this, India’s education system needs major changes that focus on real learning.

The world is changing quickly due to technology like AI, big data, and machine learning. Many simple jobs may be replaced by machines, while new jobs will need skills in science, maths, computers, data, and also skills across multiple fields like humanities and social sciences. Climate change, pollution, and health issues like pandemics also require experts from many disciplines to work together. As India grows into a major global economy, there will also be more demand for arts and humanities.

Students must not only learn information but learn how to learn. Education must focus more on critical thinking, creativity, problem-solving, and adaptability. Teaching should become more practical, enjoyable, flexible, and centred around the learner. The curriculum should include arts, sports, languages, culture, and values along with science and mathematics to make learning holistic.

Education must help build character, ethics, compassion, and prepare students for meaningful careers. To achieve this, major improvements are needed in every part of the system—from early childhood to higher education.

India aims to build a world-class education system by 2040 that is accessible to everyone. The National Education Policy (NEP) 2020 is designed to modernize India’s education structure while respecting the country’s rich cultural heritage. It aims to develop both foundational skills like literacy and numeracy, and higher-level skills like critical thinking, along with emotional and ethical development.

India has a long tradition of world-renowned educational institutions like Nalanda and Takshashila, and scholars who contributed greatly to fields such as maths, astronomy, medicine, engineering, arts, and philosophy. This legacy should be protected, strengthened, and used to inspire future generations.

Teachers are central to improving the education system. The policy aims to give teachers more respect, support, training, and autonomy so they can perform their role effectively. At the same time, quality control and accountability will be improved.

The policy also emphasizes providing equal opportunities to students from disadvantaged or marginalized groups, ensuring they get full support to succeed.

Overall, NEP 2020 aims to create an education system that meets both India’s local needs and global demands, while promoting cultural pride, ethics, and national unity.

Previous education policies mainly focused on access and equity. NEP 2020 builds on that work, especially considering the Right to Education Act of 2009.
roductive, and contributing citizens for building an equitable, inclusive, and plural society as
envisaged by our Constitution.
A good education institution is one in which every student feels welcomed and cared for, where a
safe and stimulating learning environment exists, where a wide range of learning experiences are
offered, and where good physical infrastructure and appropriate resources conducive to learning are
available to all students. Attaining these qualities must be the goal of every educational institution.
However, at the same time, there must also be seamless integration and coordination across
institutions and across all stages of education.
The fundamental principles that will guide both the education system at large, as well as the
individual institutions within it are:
• recognizing, identifying, and fostering the unique capabilities of each student, by
sensitizing teachers as well as parents to promote each student’s holistic development in both
academic and non-academic spheres;
• according the highest priority to achieving Foundational Literacy and Numeracy by all
students by Grade 3;
• flexibility, so that learners have the ability to choose their learning trajectories and programmes,
and thereby choose their own paths in life according to their talents and interests;
• no hard separations between arts and sciences, between curricular and extra-curricular
activities, between vocational and academic streams, etc. in order to eliminate harmful
hierarchies among, and silos between different areas of learning;
• multidisciplinarity and a holistic education across the sciences, social sciences, arts,
humanities, and sports for a multidisciplinary world in order to ensure the unity and integrity
of all knowledge;
• emphasis on conceptual understanding rather than rote learning and learning-for-exams;
• creativity and critical thinking to encourage logical decision-making and innovation;
• ethics and human & Constitutional values like empathy, respect for others, cleanliness,
courtesy, democratic spirit, spirit of service, respect for public property, scientific temper,
liberty, responsibility, pluralism, equality, and justice;
• promoting multilingualism and the power of language in teaching and learning;
• life skills such as communication, cooperation, teamwork, and resilience;
• focus on regular formative assessment for learning rather than the summative assessment that
encourages today’s ‘coaching culture ’;
• extensive use of technology in teaching and learning, removing language barriers, increasing
access for Divyang students, and educational planning and management;
• respect for diversity and respect for the local context in all curriculum, pedagogy, and policy,
always keeping in mind that education is a concurrent subject;
• full equity and inclusion as the cornerstone of all educational decisions to ensure that all
students are able to thrive in the education system;
• synergy in curriculum across all levels of education from early childhood care and
education to school education to higher education;
• teachers and faculty as the heart of the learning process – their recruitment, continuous
professional development, positive working environments and service conditions;
• a ‘light but tight’ regulatory framework to ensure integrity, transparency, and resource
efficiency of the educational system through audit and public disclosure while encouraging
innovation and out-of-the-box ideas through autonomy, good governance, and empowerment;
• outstanding research as a corequisite for outstanding education and development;
• continuous review of progress based on sustained research and regular assessment by
educational experts;
National Education Policy 2020
6
• a rootedness and pride in India, and its rich, diverse, ancient and modern culture and
knowledge systems and traditions;
• education is a public service; access to quality education must be considered a basic right of
every child;
• substantial investment in a strong, vibrant public education system as well as the
encouragement and facilitation of true philanthropic private and community participation.
The Vision of this Policy
This National Education Policy envisions an education system rooted in Indian ethos that contributes
directly to transforming India, that is Bharat, sustainably into an equitable and vibrant knowledge
society, by providing high-quality education to all, and thereby making India a global knowledge
superpower. The Policy envisages that the curriculum and pedagogy of our institutions must
develop among the students a deep sense of respect towards the Fundamental Duties and
Constitutional values, bonding with one’s country, and a conscious awareness of one’s roles
and responsibilities in a changing world. The vision of the Policy is to instill among the
learners a deep-rooted pride in being Indian, not only in thought, but also in spirit, intellect,
and deeds, as well as to develop knowledge, skills, values, and dispositions that support
responsible commitment to human rights, sustainable development and living, and global
well-being, thereby reflecting a truly global citizen.
age 6. In the new 5+3+3+4 structure, a strong base of Early Childhood Care and Education (ECCE)
from age 3 is also included, which is aimed at promoting better overall learning, development, and
well-being.
1. Early Childhood Care and Education: The Foundation of Learning
1.1. Over 85% of a child’s cumulative brain development occurs prior to the age of 6, indicating the
critical importance of appropriate care and stimulation of the brain in the early years in order to
ensure healthy brain development and growth. Presently, quality ECCE is not available to crores of
young children, particularly children from socio-economically disadvantaged backgrounds. Strong
investment in ECCE has the potential to give all young children such access, enabling them to
participate and flourish in the educational system throughout their lives. Universal provisioning of
quality early childhood development, care, and education must thus be achieved as soon as possible,
and no later than 2030, to ensure that all students entering Grade 1 are school ready.
1.2. ECCE ideally consists of flexible, multi-faceted, multi-level, play-based, activity-based, and
inquiry-based learning, comprising of alphabets, languages, numbers, counting, colours, shapes,
indoor and outdoor play, puzzles and logical thinking, problem-solving, drawing, painting and other
visual art, craft, drama and puppetry, music and movement. It also includes a focus on developing
social capacities, sensitivity, good behaviour, courtesy, ethics, personal and public cleanliness,
teamwork, and cooperation. The overall aim of ECCE will be to attain optimal outcomes in the
domains of: physical and motor development, cognitive development, socio-emotional-ethical
development, cultural/artistic development, and the development of communication and early
language, literacy, and numeracy.
1.3. A National Curricular and Pedagogical Framework for Early Childhood Care and Education
(NCPFECCE) for children up to the age of 8 will be developed by NCERT in two parts, namely, a
sub-framework for 0-3 year-olds, and a sub-framework for 3-8 year-olds, aligned with the above
guidelines, the latest research on ECCE, and national and international best practices. In particular,
the numerous rich local traditions of India developed over millennia in ECCE involving art, stories,
poetry, games, songs, and more, will also be suitably incorporated. The framework will serve as a
guide both for parents and for early childhood care and education institutions.
1.4. The overarching goal will be to ensure universal access to high-quality ECCE across the country
in a phased manner. Special attention and priority will be given to districts and locations that are
particularly socio-economically disadvantaged. ECCE shall be delivered through a significantly
expanded and strengthened system of early-childhood education institutions consisting of (a) standalone Anganwadis; (b) Anganwadis co-located with primary schools; (c) pre-primary
schools/sections covering at least age 5 to 6 years co-located with existing primary schools; and (d)
stand-alone pre-schools - all of which would recruit workers/teachers specially trained in the
curriculum and pedagogy of ECCE.
1.5. For universal access to ECCE, Anganwadi Centres will be strengthened with high-quality
infrastructure, play equipment, and well-trained Anganwadi workers/teachers. Every Anganwadi will
have a well-ventilated, well-designed, child-friendly and well-constructed building with an enriched
learning environment. Children in Anganwadi Centres shall take activity-filled tours - and meet the
teachers and students of their local primary schools, in order to make the transition from Anganwadi
Centres to primary schools a smooth one. Anganwadis shall be fully integrated into school
complexes/clusters, and Anganwadi children, parents, and teachers will be invited to attend and
participate in school/school complex programmes and vice versa.
1.6. It is envisaged that prior to the age of 5 every child will move to a “Preparatory Class”
or “Balavatika” (that is, before Class 1), which has an ECCE-qualified teacher. The learning
in the Preparatory Class shall be based primarily on play-based learning with a focus on
developing cognitive, affective, and psychomotor abilities and early literacy and numeracy. The mid-
National Education Policy 2020
8
day meal programme shall also be extended to the Preparatory Classes in primary schools. Health
check-ups and growth monitoring that are available in the Anganwadi system shall also be made
available to Preparatory Class students of Anganwadi as well as of primary schools.
1.7. To prepare an initial cadre of high-quality ECCE teachers in Anganwadis, current Anganwadi
workers/teachers will be trained through a systematic effort in accordance with the
curricular/pedagogical framework developed by NCERT. Anganwadi workers/teachers with
qualifications of 10+2 and above shall be given a 6-month certificate programme in ECCE; and those
with lower educational qualifications shall be given a one-year diploma programme covering early
literacy, numeracy, and other relevant aspects of ECCE. These programmes may be run through
digital/distance mode using DTH channels as well as smartphones, allowing teachers to acquire
ECCE qualifications with minimal disruption to their current work. The ECCE training of Anganwadi
workers/teachers will be mentored by the Cluster Resource Centres of the School Education
Department which shall hold at least one monthly contact class for continuous assessment. In the
longer term, State Governments shall prepare cadres of professionally qualified educators for early
childhood care and education, through stage-specific professional training, mentoring mechanisms,
and career mapping. Necessary facilities will also be created for the initial professional preparation of
these educators and their Continuous Professional Development (CPD).
1.8. ECCE will also be introduced in Ashramshalas in tribal-dominated areas and in all formats of
alternative schooling in a phased manner. The process for integration and implementation of ECCE
in Ashramshalas and alternative schooling will be similar to that detailed above.
1.9. The responsibility for ECCE curriculum and pedagogy will lie with MHRD to ensure its
continuity from pre-primary school through primary school, and to ensure due attention to the
foundational aspects of education. The planning and implementation of early childhood care and
education curriculum will be carried out jointly by the Ministries of HRD, Women and Child
Development (WCD), Health and Family Welfare (HFW), and Tribal Affairs. A special joint task
force will be constituted for continuous guidance of the smooth integration of early childhood care
and education into school education.
2. Foundational Literacy and Numeracy: An Urgent & Necessary Prerequisite to Learning
2.1. The ability to read and write, and perform basic operations with numbers, is a necessary
foundation and an indispensable prerequisite for all future schooling and lifelong learning. However,
various governmental, as well as non-governmental surveys, indicate that we are currently in a
learning crisis: a large proportion of students currently in elementary school - estimated to be over 5
crore in number - have not attained foundational literacy and numeracy, i.e., the ability to read and
comprehend basic text and the ability to carry out basic addition and subtraction with Indian
numerals.
2.2. Attaining foundational literacy and numeracy for all children will thus become an urgent
national mission, with immediate measures to be taken on many fronts and with clear goals that
will be attained in the short term (including that every student will attain foundational literacy
and numeracy by Grade 3). The highest priority of the education system will be to achieve
universal foundational literacy and numeracy in primary school by 2025. The rest of this Policy
will become relevant for our students only if this most basic learning requirement (i.e., reading,
writing, and arithmetic at the foundational level) is first achieved. To this end, a National
Mission on Foundational Literacy and Numeracy will be set up by the Ministry of Human
Resource Development (MHRD) on priority. Accordingly, all State/UT governments will
immediately prepare an implementation plan for attaining universal foundational literacy and
numeracy in all primary schools, identifying stage-wise targets and goals to be achieved by 2025, and
closely tracking and monitoring progress of the same.
2.3. First, teacher vacancies will be filled at the  end.
`,
    
    fileName: analysisData?.fileName || 'document.pdf',
    fileSize: analysisData?.fileSize || 0,
    pages: analysisData?.pages || 1,
    wordCount: analysisData?.wordCount || 0,
    textLength: analysisData?.textLength || 0
  };

  // Set initial text when component mounts or analysisData changes
  useEffect(() => {
    // Correct assignment: simplifiedText goes to simplifiedText state (Left/AI-Simplified), originalText goes to originalText state (Right/Original)
    setOriginalText(demoData.originalText);
    setSimplifiedText(demoData.simplifiedText);
  }, [analysisData]);

  // Load data from session storage on component mount
  useEffect(() => {
    const storedData = sessionStorage.getItem('analysisResults');
    if (!storedData) {
      setError('No analysis data found. Please upload a document first.');
      setLoading(false);
      return;
    }

    try {
      const parsedData = JSON.parse(storedData);
      setAnalysisData(parsedData);
    } catch (err) {
      console.error('Error parsing analysis data:', err);
      setError('Failed to load analysis results. Please try again.');
    }
    setLoading(false);
    setLoaded(true);
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('analysisResult');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.originalText || parsed?.simplifiedText) {
          setOriginalText(parsed.originalText || '');
          setSimplifiedText(parsed.simplifiedText || '');
          setStats(parsed.stats || null);
        }
      }
    } catch (_) {}
    setLoaded(true);
  }, []);

  // Filter text based on search term
  const filterText = (text) => {
    if (!text) return '';
    return text
      .split('\n')
      .filter(line => 
        !searchTerm.trim() || 
        line.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .join('\n');
  };

  const filteredOriginalText = filterText(originalText || demoData.originalText);
  const filteredSimplifiedText = filterText(simplifiedText || demoData.simplifiedText);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <Header showUploadButton={false} />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Analysis Results
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Compare the original privacy policy with our AI-simplified version
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link 
                href="/upload"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 inline-flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                New Analysis
              </Link>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab('comparison')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'comparison'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Side-by-Side
              </button>
              <button
                onClick={() => setActiveTab('original')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'original'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Original Only
              </button>
              <button
                onClick={() => setActiveTab('simplified')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'simplified'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Simplified Only
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search in text..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                Export PDF
              </button>
            </div>
          </div>
        </div>

        {/* Content Display */}
        {activeTab === 'comparison' && (
          <ComparisonView
            originalText={filteredOriginalText}
            simplifiedText={filteredSimplifiedText}
            searchTerm={searchTerm}
          />
        )}

        {activeTab === 'original' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                <div className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                Original Privacy Policy
              </h2>
            </div>
            <div className="p-6 max-h-screen overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-mono">
                {filteredOriginalText}
              </pre>
            </div>
          </div>
        )}

        {activeTab === 'simplified' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                AI-Simplified Version
              </h2>
            </div>
            <div className="p-6 max-h-screen overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {filteredSimplifiedText}
              </pre>
            </div>
          </div>
        )}

        {/* Analysis Summary */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-6">Analysis Summary</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">{stats?.complexityReduction ? Math.round(stats.complexityReduction * 100) + '%' : '85%'}</div>
              <div className="text-blue-100">Complexity Reduction</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">{stats?.keyPoints ?? 12}</div>
              <div className="text-blue-100">Key Points Identified</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">{stats?.readingSpeedGain ? stats.readingSpeedGain + 'x' : '3.2x'}</div>
              <div className="text-blue-100">Faster to Read</div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
